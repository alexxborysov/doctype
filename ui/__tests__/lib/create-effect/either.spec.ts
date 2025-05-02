import { CanceledError } from 'axios';
import { delay, http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { describe, it, expect, afterAll, afterEach, beforeAll, vi } from 'vitest';
import { apiClient } from '~/interface/shared/api-client/mod.api-client';
import {
  createEffect,
  UNEXPECTED_ERROR,
  EffectError,
  EffectCanceledError,
  EFFECT_CANCELED,
  EFFECT_ONCE_RESTRICTION,
} from '~/interface/shared/lib/create-effect';

const SUCCESS_OUTPUT = { ok: true };
const server = setupServer(
  http.get('/test', async () => {
    await delay(20);
    return HttpResponse.json(SUCCESS_OUTPUT, { status: 200 });
  })
);

describe('[lib]:create-effect:either', () => {
  beforeAll(async () => {
    server.listen();
  });
  afterAll(() => {
    server.close();
  });
  afterEach(() => {
    server.resetHandlers();
    vi.resetAllMocks();
  });

  it('should return output on successful execution', async () => {
    const effect = createEffect(async () => SUCCESS_OUTPUT);
    const { data, error } = await effect.run();

    expect(data).toBe(SUCCESS_OUTPUT);
    expect(error).toBeUndefined();

    expect(effect.meta.status).toBe('fulfilled');
    expect(effect.meta.error).toBeNull();
  });

  it('should return an unexpected error when an unknown error occurs', async () => {
    const effect = createEffect(async () => {
      throw new EffectError();
    });
    const { data, error } = await effect.run();

    expect(data).toBeUndefined();
    expect(error).toEqual({ unexpected: UNEXPECTED_ERROR });

    expect(effect.meta.status).toBe('rejected');
    expect(effect.meta.error?.unexpected).toBeDefined();
  });

  it('should handle EffectError properly', async () => {
    const ERROR_PAYLOAD = { message: 'ERROR' };
    const effect = createEffect(async () => {
      throw new EffectError(ERROR_PAYLOAD);
    });
    const { data, error } = await effect.run();

    expect(data).toBeUndefined();
    expect(error).toBeDefined();
    expect(error?.payload).toStrictEqual(ERROR_PAYLOAD);

    expect(effect.meta.status).toBe('rejected');
    expect(effect.meta.error?.payload).toStrictEqual(ERROR_PAYLOAD);

    expect(effect.meta.error?.canceled).toBeUndefined();
    expect(effect.meta.error?.onceRestriction).toBeUndefined();
    expect(effect.meta.error?.unexpected).toBeUndefined();
  });

  it('should mark error as aborted when cancelled', async () => {
    const effect = createEffect(async (_, { signal }) => {
      const { success, error } = await apiClient.query<typeof SUCCESS_OUTPUT>({
        url: '/test',
        method: 'GET',
        signal,
      });
      if (error instanceof CanceledError) {
        throw new EffectCanceledError();
      }
      return success;
    });

    setTimeout(effect.cancel, 5);
    const { data, error } = await effect.run();

    expect(data).toBeUndefined();
    expect(error).toEqual({ canceled: EFFECT_CANCELED });

    expect(effect.meta.status).toBe('rejected');
    expect(effect.meta.error?.canceled).toBeDefined();
    expect(effect.meta.error?.onceRestriction).toBeUndefined();
    expect(effect.meta.error?.unexpected).toBeUndefined();
  });

  it('should enforce once restriction', async () => {
    const effect = createEffect(async () => SUCCESS_OUTPUT, {
      once: true,
    });
    await effect.run();

    const { data, error } = await effect.run();
    expect(data).toBeUndefined();
    expect(error).toEqual({ onceRestriction: EFFECT_ONCE_RESTRICTION });
    expect(effect.meta.status).toBe('fulfilled');

    expect(effect.meta.error?.onceRestriction).toBeDefined();
    expect(effect.meta.error?.unexpected).toBeUndefined();
    expect(effect.meta.error?.canceled).toBeUndefined();
  });
});
