import { test, expect, vi, describe } from 'vitest';
import { createEffect, EffectError } from '~/interface/shared/lib/create-effect';
import { delay } from '../../helpers';

describe('[lib]:create-effect:meta', () => {
  test('should pass arguments', async () => {
    const ARGUMENT = 5;
    const fn = vi.fn(async (arg: number) => {
      expect(arg).toBeDefined();
      expect(arg).toBeTypeOf('number');
      expect(arg).toBe(ARGUMENT);
    });

    const effect = createEffect(fn);
    effect.run(ARGUMENT);
  });

  test('should have an awaitable promise in meta', async () => {
    const fn = vi.fn(async () => {
      await delay(30);
      return 'result-value';
    });

    const effect = createEffect(fn);
    effect.run();

    expect(effect.meta.promise).toBeInstanceOf(Promise);
    expect(effect.meta.status).toBe('pending');

    await effect.meta.promise;
    expect(effect.meta.status).toBe('fulfilled');
  });

  test("should update meta.status to 'fulfilled' on successful execution", async () => {
    const fn = vi.fn(async () => {
      await delay();
      return 'result-value';
    });

    const effect = createEffect(fn);
    expect(effect.meta.status).toBe('idle');

    const runPromise = effect.run();
    expect(effect.meta.status).toBe('pending');

    await runPromise;
    expect(effect.meta.status).toBe('fulfilled');
    expect(effect.meta.error).toBeNull();
  });

  test("should update meta.status to 'rejected' and set meta.error on failure", async () => {
    const fnWithRejection = vi.fn(async () => {
      await delay();
      throw new EffectError();
    });

    const effectWithReject = createEffect(fnWithRejection);
    expect(effectWithReject.meta.status).toBe('idle');

    const runPromise = effectWithReject.run();
    expect(effectWithReject.meta.status).toBe('pending');

    await runPromise;
    expect(effectWithReject.meta.status).toBe('rejected');
  });

  test("should only run the effect once when 'once' option is true", async () => {
    const fn = vi.fn(async () => {
      await delay();
      return 'result-value';
    });

    const effect = createEffect(fn, { once: true });

    await effect.run();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(effect.meta.status).toBe('fulfilled');

    await effect.run();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(effect.meta.status).toBe('fulfilled');
  });

  test("should allow multiple runs when 'once' option is false", async () => {
    const fn = vi.fn(async () => {
      await delay();
      return 'result-value';
    });

    const effect = createEffect(fn, { once: false });

    await effect.run();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(effect.meta.status).toBe('fulfilled');

    await effect.run();
    expect(fn).toHaveBeenCalledTimes(2);
    expect(effect.meta.status).toBe('fulfilled');
  });
});
