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
  ErrorPayload = { message: Option<ErrorMessage> },
  Params = void,
>(runner: Runner<Success, Params>, options: { once?: boolean } = { once: false }) {
  const meta: Meta<ErrorPayload> = observable({
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
    run: async (args: Params): RunnerEitherOutput<Success, ErrorPayload> => {
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
        .then((runnerOutput) => {
          runInAction(() => {
            meta.status = 'fulfilled';
          });
          return { success: runnerOutput };
        })
        .catch((runnerError) => {
          runInAction(() => {
            meta.status = 'rejected';
          });
          const error = withErrorFlags<ErrorPayload>(runnerError);
          runInAction(() => {
            meta.error = error;
          });
          return { error };
        })
        .finally(() => {
          metaPromiseResolver?.();
        });
    },
  };
}

const withErrorFlags = <Payload>(error: unknown): ErrorOutput<Payload> => {
  if (error instanceof EffectError) {
    return { payload: error?.payload as Payload };
  }
  if (error instanceof EffectCanceledError) {
    return { canceled: EFFECT_CANCELED };
  }
  return { unexpected: UNEXPECTED_ERROR };
};

export type Runner<Output = unknown, Arguments = void> = (
  args: Arguments,
  options: { signal: AbortSignal }
) => Promise<Output>;

export type RunnerEitherOutput<Success, ErrorOutputPayload> = Promise<{
  success?: Success;
  error?: ErrorOutput<ErrorOutputPayload>;
}>;

export type ErrorOutput<Payload> = ErrorFlags & {
  payload?: Payload;
};

export type ErrorFlags = {
  canceled?: typeof EFFECT_CANCELED;
  unexpected?: typeof UNEXPECTED_ERROR;
  onceRestriction?: typeof EFFECT_ONCE_RESTRICTION;
};

export type EffectStatus = 'idle' | 'pending' | 'fulfilled' | 'rejected';
export type Meta<ErrorPayload> = {
  status: EffectStatus;
  promise: Option<Promise<void>>;
  error: Option<ErrorOutput<ErrorPayload>>;
};

export class EffectCanceledError extends Error {
  constructor() {
    super();
    this.name = EFFECT_CANCELED;
  }
}
export class EffectError extends Error {
  payload: Option<unknown>;
  constructor(payload?: unknown) {
    super();
    this.payload = payload ?? null;
    this.name = EFFECT_ERROR;
  }
}
