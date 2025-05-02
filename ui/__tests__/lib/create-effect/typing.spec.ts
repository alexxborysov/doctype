import { describe, it, expectTypeOf } from 'vitest';
import {
  createEffect,
  EffectCanceledError,
  EffectError,
  EitherErrorOutput,
} from '~/interface/shared/lib/create-effect';

describe('[lib]:create-effect:typing', () => {
  it('infers SuccessOutput from the runner function', async () => {
    const effect = createEffect(async () => 'OUTPUT');
    const result = await effect.run();
    expectTypeOf(result.data).toEqualTypeOf<string | undefined>();
  });

  it('produces correct error type when runner throws an EffectError', async () => {
    const effect = createEffect<number, { message: string }>(async () => {
      throw new EffectError({ message: 'error occurred' });
    });
    const output = await effect.run();
    expectTypeOf(output.error).toMatchTypeOf<
      EitherErrorOutput<{ message: string }> | undefined
    >();
  });

  it('produces correct error type when runner throws a CanceledError', async () => {
    const effect = createEffect<number, { message: string }>(async () => {
      throw new EffectCanceledError();
    });
    const output = await effect.run();
    expectTypeOf(output.error).toMatchTypeOf<
      EitherErrorOutput<{ message: string }> | undefined | undefined
    >();
  });

  it('produces correct error type when runner throws an unexpected error', async () => {
    const effect = createEffect<number, { message: string }>(async () => {
      throw new EffectError('unexpected error');
    });
    const output = await effect.run();
    expectTypeOf(output.error).toMatchTypeOf<
      EitherErrorOutput<{ message: string }> | undefined | undefined
    >();
  });

  it('produces correct error type for once restriction', async () => {
    const effect = createEffect<number, { message: string }>(async () => 42, { once: true });

    const first = await effect.run();
    expectTypeOf(first.data).toEqualTypeOf<number | undefined>();

    const second = await effect.run();
    expectTypeOf(second.error).toMatchTypeOf<
      EitherErrorOutput<{ message: string }> | undefined | undefined
    >();
  });
});
