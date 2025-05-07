import * as _Sentry from '@sentry/react';

export const Sentry = _Sentry;
export function setupSentry() {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_ENV,
    sendDefaultPii: true,
  });
}
