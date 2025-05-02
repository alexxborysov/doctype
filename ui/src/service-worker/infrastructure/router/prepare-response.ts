import { type AxiosError } from 'axios';
import { Option } from 'core';

export function prepareResponse(responseData: any): Response {
  return new Response(JSON.stringify(responseData), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function prepareErrorResponse(error: Option<Partial<AxiosError>>): Response {
  const errorData = JSON.stringify(error?.response?.data) || null;
  const headers = new Headers((error?.response?.headers as any) ?? {});

  return new Response(errorData, {
    status: error?.response?.status ?? 304,
    statusText: error?.response?.statusText,
    headers,
  });
}
