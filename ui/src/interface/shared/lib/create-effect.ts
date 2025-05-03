import { Option } from 'core';
import { observable, runInAction } from 'mobx';
import { ErrorMessage } from '../types/common';

export const EFFECT_ERROR = 'EFFECT_ERROR' as const;
export const EFFECT_CANCELED = 'EFFECT_CANCELED' as const;
export const EFFECT_ONCE_RESTRICTION = 'EFFECT_ONCE_RESTRICTION' as const;
export const UNEXPECTED_ERROR = 'UNEXPECTED_ERROR' as const;

/**
 * @description createEffect<Success, Error, Arguments>
 */
export function createEffect<
  Success = unknown,
  Error = { message: Option<ErrorMessage> },
  Params = void,
>(runner: Runner<Success, Params>, options: { once?: boolean } = { once: false }) {
  const meta: Meta<Error> = observable({
    status: 'idle',
    promise: null,
    error: null,
  });

  let controllers = [] as Array<AbortController>;
  let metaPromiseResolver: VoidFunction;

  function cancel() {
    controllers.forEach((signal) => signal.abort(EFFECT_CANCELED));
    controllers = [];
  }

  return {
    meta,
    cancel,
    run: async (args: Params): RunnerEitherOutput<Success, Error> => {
      const restrictedByOnce = options.once && meta.status !== 'idle';
      if (restrictedByOnce) {
        runInAction(() => {
          meta.error = { onceRestriction: EFFECT_ONCE_RESTRICTION };
        });
        return { error: { onceRestriction: EFFECT_ONCE_RESTRICTION } };
      }

      const controller = new AbortController();
      controllers.push(controller);

      runInAction(() => {
        meta.error = null;
        meta.status = 'pending';
        meta.promise = new Promise<void>((_resolve) => {
          metaPromiseResolver = _resolve;
        });
      });

      return await runner(args, { signal: controller.signal })
        .then((output) => {
          runInAction(() => {});
          meta.status = 'fulfilled';
          return { data: output };
        })
        .catch((error) => {
          runInAction(() => {});
          meta.status = 'rejected';
          let errorOutput: EitherErrorOutput<Error>;

          if (error instanceof EffectError) {
            errorOutput = { payload: error.payload as Error };
            console.log(errorOutput);
          } else if (error instanceof EffectCanceledError) {
            errorOutput = { canceled: EFFECT_CANCELED };
          } else {
            errorOutput = { unexpected: UNEXPECTED_ERROR };
          }

          runInAction(() => {
            meta.error = errorOutput;
          });
          return { error: errorOutput };
        })
        .finally(() => {
          metaPromiseResolver?.();
        });
    },
  };
}

export type Runner<Output = unknown, Arguments = void> = (
  args: Arguments,
  options: { signal: AbortSignal }
) => Promise<Output>;

export type RunnerEitherOutput<SuccessOutput, ErrorOutputPayload> = Promise<{
  data?: SuccessOutput;
  error?: EitherErrorOutput<ErrorOutputPayload>;
}>;

export type EitherErrorOutput<ErrorOutput> = ErrorFlags & {
  payload?: ErrorOutput;
};

export type ErrorFlags = {
  canceled?: typeof EFFECT_CANCELED;
  unexpected?: typeof UNEXPECTED_ERROR;
  onceRestriction?: typeof EFFECT_ONCE_RESTRICTION;
};

export type EffectStatus = 'idle' | 'pending' | 'fulfilled' | 'rejected';
export type Meta<ErrorOutput> = {
  status: EffectStatus;
  promise: Promise<void> | null;
  error: EitherErrorOutput<ErrorOutput> | null;
};

export class EffectCanceledError extends Error {
  constructor() {
    super();
    this.name = EFFECT_CANCELED;
  }
}
export class EffectError extends Error {
  payload: unknown | null;
  constructor(payload?: unknown) {
    super();
    this.payload = payload;
    this.name = EFFECT_ERROR;
  }
}
