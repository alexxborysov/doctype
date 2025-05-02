import { z } from 'zod';
import { Viewer } from '~/domain/viewer';
import { apiClient } from '~/interface/shared/api-client/mod.api-client';
import { SignUpDto, VerificationDto } from 'core/src';

export const api = {
  async signUp({ data }: { data: z.infer<typeof SignUpDto> }) {
    return apiClient.query<{ createdUser: Viewer }>({
      url: 'auth/sign-up',
      method: 'POST',
      data,
    });
  },

  async verify({ data }: { data: z.infer<typeof VerificationDto> }) {
    return apiClient.query<{
      verified: boolean;
    }>({
      url: 'auth/verify',
      method: 'PUT',
      data,
    });
  },
};
