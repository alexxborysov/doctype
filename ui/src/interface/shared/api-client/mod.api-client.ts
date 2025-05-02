import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { serviceWorkerState } from '~/interface/kernel/network/sw-state';
import { ApiClientResponse, ApiErrorData } from '../types/common';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export const apiClient = {
  async query<R>(config: AxiosRequestConfig) {
    let _res: ApiClientResponse<R> = {
      success: null,
      error: null,
    };

    async function executeQuery() {
      await instance
        .request<R>(config)
        .then((res: any) => {
          _res = { error: null, success: res.data };
        })
        .catch((err: AxiosError<ApiErrorData, any>) => {
          const code = err?.response?.data?.statusCode ?? 304;
          const _err = code >= 200 && code < 500 ? err : UNEXPECTED_ERROR;

          _res = { success: null, error: _err };
        });
    }

    await serviceWorkerState.activated;
    await executeQuery().catch(() => {});

    return {
      success: _res.success,
      error: _res.error,
    };
  },
};

const UNEXPECTED_ERROR: AxiosError<ApiErrorData, any> | undefined = {
  response: {
    data: {
      message: "Oops! It seems we've hit a bump in the road..",
      statusCode: 304,
    },
    status: 304,
    statusText: 'UNEXPECTED',
  } as any,
  isAxiosError: true,
  name: 'UNEXPECTED',
  code: '304',
  toJSON: () => ({}),
  message: "Oops! It seems we've hit a bump in the road..",
};
