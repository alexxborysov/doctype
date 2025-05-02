import { type AxiosHeaders } from 'axios';
import { AnyPayload } from '../api-client/mod.api-client';

export function parseRequestInstance(req: Request, payload?: AnyPayload) {
  const headers = Object.fromEntries(req.headers.entries());
  const parsedReq = JSON.parse(
    JSON.stringify(req, [
      'bodyUsed',
      'cache',
      'credentials',
      'destination',
      'integrity',
      'isHistoryNavigation',
      'keepalive',
      'method',
      'mode',
      'redirect',
      'referrer',
      'referrerPolicy',
      'signal',
      'url',
    ])
  );

  return { ...parsedReq, headers, payload };
}

export type ParsedRequest = Partial<
  Omit<Request, 'arrayBuffer' | 'clone' | 'json' | 'blob' | 'text' | 'body' | 'headers'>
> & {
  headers?: AxiosHeaders;
  payload?: AnyPayload;
};
