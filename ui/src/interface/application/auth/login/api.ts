import type { User } from '@prisma/client';
import { z } from 'zod';
import { AuthTokens } from '~/domain/auth';
import { Viewer } from '~/domain/viewer';
import { apiClient } from '~/interface/shared/api-client/mod.api-client';
import { LoginDto } from 'core/src';
import { GoogleToken } from '../oauth/google';

export const api = {
  async login({ data }: { data: z.infer<typeof LoginDto> }) {
    return apiClient.query<{
      tokens: AuthTokens;
      user: Viewer;
    }>({
      url: 'auth/login',
      method: 'POST',
      data,
    });
  },

  async googleLogin({ googleToken }: { googleToken: GoogleToken }) {
    return apiClient.query<{
      tokens: AuthTokens;
      user: User;
    }>({
      url: 'auth/google-login',
      method: 'GET',
      headers: {
        oauth: googleToken,
      },
    });
  },
};
