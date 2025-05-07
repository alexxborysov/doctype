/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_ASSETS: string;

  VITE_SW_ASSET: string;

  VITE_APP_URL: string;

  VITE_BACKEND_URL: string;

  VITE_GOOGLE_CLIENT_ID: string;

  VITE_GITHUB_APP_CLIENT_ID: string;

  VITE_SENTRY_DSN: string;

  VITE_ENV: 'development' | 'production';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
