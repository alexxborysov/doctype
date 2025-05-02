import { Viewer } from '~/domain/viewer';
import { apiClient } from '~/interface/shared/api-client/mod.api-client';

export const api = {
  async getSession() {
    return apiClient.query<{ viewer: Viewer }>({
      url: 'auth/session',
      method: 'GET',
    });
  },
};
