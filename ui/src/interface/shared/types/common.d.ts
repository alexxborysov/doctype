import { Option } from 'core';

declare type IconName = string;

declare type DateString = string;

declare type RoutePath = string;

declare type EffectStatus = 'idle' | 'pending' | 'fulfilled' | 'rejected';

declare type ErrorMessage = Option<string>;

type ApiErrorData = {
  message: ErrorMessage;
  statusCode: number;
};

declare type ApiClientResponse<R> = {
  success: Option<R>;
  error: Option<import('axios').AxiosError<ApiErrorData>>;
};
