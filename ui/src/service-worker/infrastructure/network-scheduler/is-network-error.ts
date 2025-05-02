import { AxiosError } from 'axios';
import { Option } from 'core';
import { ApiErrorData } from '~/interface/shared/types/common';

export function isNetworkError(error: Option<AxiosError<ApiErrorData, any>>) {
  if (!error?.code) return false;
  return (
    error.code === 'ERR_NETWORK' ||
    error.code === 'ERR_CANCELED' ||
    error.code === 'ENOTFOUND' ||
    error.code === 'ECONNRESET' ||
    error.code === 'ETIMEOUT'
  );
}
