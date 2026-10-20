import * as Sentry from '@sentry/react';

/**
 * Optional error reporting. It only turns on when VITE_SENTRY_DSN is set at build time, so the app stays fully
 * local and sends nothing by default. Study progress and notes are never attached to events.
 */
export function initMonitoring(): boolean {
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) return false;
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0,
    // Hash routes can carry lesson ids only, but strip query strings anyway.
    beforeSend(event) {
      if (event.request?.url) event.request.url = event.request.url.split('?')[0];
      return event;
    },
  });
  return true;
}

export { Sentry };
