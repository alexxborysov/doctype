import { Tag } from 'core/src';

export type AuthTokens = Tag<
  {
    access: string;
    refresh: string;
  },
  'auth-tokens'
>;

export const AUTH_MESSAGES = {
  LOGOUT: 'LOGOUT',
  SESSION_UPDATED: 'SESSION_UPDATED',
} as const;
