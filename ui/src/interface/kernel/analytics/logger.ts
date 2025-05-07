import { Sentry } from '~/interface/shared/analytics/sentry';

export interface Logger {
  error: (
    message: string,
    info?: {
      tags?: Record<string, string>;
      extra?: Record<string, any>;
    }
  ) => void;
  log: (
    message: string,
    info?: {
      tags?: Record<string, string>;
      extra?: Record<string, any>;
    }
  ) => void;
}

const sentryLogger: Logger = {
  error: (message, info) => {
    Sentry.captureMessage(message, {
      level: 'error',
      tags: info?.tags,
      extra: info?.extra,
    });
  },
  log: (message, info) => {
    Sentry.captureMessage(message, {
      level: 'info',
      tags: info?.tags,
      extra: info?.extra,
    });
  },
};

const localLogger: Logger = {
  error: (message, info) => {
    console.error(message, {
      tags: info?.tags,
      extra: info?.extra,
    });
  },
  log: (message, info) => {
    console.log(message, {
      tags: info?.tags,
      extra: info?.extra,
    });
  },
};

const map: Record<ImportMeta['env']['VITE_ENV'], Logger> = {
  development: localLogger,
  production: sentryLogger,
};

export const logger = map[import.meta.env.VITE_ENV];
