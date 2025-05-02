import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { AuthTokens } from '~/domain/auth';
import { ApiClientResponse } from '~/interface/shared/types/common';
import { authService } from '~/service-worker/services/auth.service';
import { ParsedRequest } from '../lib/request.parser';
import fetchAdapter from './fetch.adapter';

const REFRESH_TOKENS_API_PATH = 'auth/refresh';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,

  adapter: fetchAdapter,
});

instance.interceptors.request.use(async (config) => {
  config.headers['Content-Type'] = 'application/json';
  const tokens = await authService.getTokens();

  if (tokens?.access) {
    config.headers.Authorization = `Bearer ${tokens.access}`;
  }

  return config;
});

let refreshQueryPromise: Promise<void> | null = null;
function refreshTokens() {
  const queryPending = Boolean(refreshQueryPromise);
  if (queryPending) {
    return refreshQueryPromise;
  }

  refreshQueryPromise = new Promise<void>((resolve) => {
    const task = async () => {
      const storedTokens = await authService.getTokens();
      if (storedTokens?.refresh) {
        const refreshed = await instance
          .request<AuthTokens>({
            url: REFRESH_TOKENS_API_PATH,
            method: 'GET',
            headers: {
              refresh: storedTokens?.refresh,
            },
          })
          .then(({ data }) => data)
          .catch(async (error) => {
            const status = (error as AxiosError).response?.status;
            if (status === 423) {
              await authService.removeSession();
              await authService.removeTokens();
            }
          });

        if (refreshed) {
          await authService.updateTokens(refreshed);
        }
      }
      refreshQueryPromise = null;
      resolve();
    };
    task();
  });

  return refreshQueryPromise;
}

export const swApiClient = {
  async query<R>({ parsedRequest }: { parsedRequest: ParsedRequest }) {
    let _res: ApiClientResponse<R> = {
      success: null,
      error: null,
    };

    async function executeQuery(override?: AxiosRequestConfig) {
      await instance
        .request<R>({ ...parsedRequest, data: parsedRequest.payload, ...override })
        .then((res) => (_res = { error: null, success: res.data }))
        .catch((err) => (_res = { success: null, error: err }));
    }

    await refreshQueryPromise;
    await executeQuery();

    if (_res?.error?.response && [401, 403].includes(_res.error.response.status)) {
      await refreshTokens();
      await executeQuery();
    }

    return {
      success: _res?.success,
      error: _res?.error,
    };
  },
};

export type AnyPayload = Record<string, any>;
