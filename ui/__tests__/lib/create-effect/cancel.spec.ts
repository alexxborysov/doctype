import { CanceledError } from 'axios';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { test, expect, vi, describe, beforeAll, afterEach, afterAll } from 'vitest';
import { apiClient } from '~/interface/shared/api-client/mod.api-client';
import {
  createEffect,
  EFFECT_CANCELED,
  EffectCanceledError,
} from '~/interface/shared/lib/create-effect';
import { delay } from '../../helpers';

const SUCCESS_OUTPUT = { ok: true };
const server = setupServer(
  http.get('/test', async () => {
    await delay(40);
    return HttpResponse.json(SUCCESS_OUTPUT, { status: 200 });
  })
);

describe('[lib]:create-effect:cancel', () => {
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

  test('should cancel single effect runner', async () => {
    effect.run();
    effect.cancel();
    await effect.meta.promise;

    expect(effect.meta.status).toBe('rejected');
    expect(effect.meta.error).toEqual({ canceled: EFFECT_CANCELED });

    const successRunner = await effect.run();
    expect(successRunner.data).toEqual(SUCCESS_OUTPUT);
  });

  test('should cancel multiple effect runner', async () => {
    setTimeout(() => effect.cancel(), 20);
    const abortedRunners = await Promise.all(Array.from({ length: 5 }, effect.run));
    expect(effect.meta.status).toEqual('rejected');
    expect(abortedRunners).toEqual(Array(5).fill({ error: { canceled: EFFECT_CANCELED } }));

    setTimeout(() => effect.cancel(), 20);
    const secondAbortedRunners = await Promise.all(Array.from({ length: 5 }, effect.run));
    expect(effect.meta.status).toEqual('rejected');
    expect(secondAbortedRunners).toEqual(
      Array(5).fill({ error: { canceled: EFFECT_CANCELED } })
    );

    const successRunner = await effect.run();
    expect(effect.meta.status).toEqual('fulfilled');
    expect(successRunner.data).toEqual(SUCCESS_OUTPUT);
  });
});
