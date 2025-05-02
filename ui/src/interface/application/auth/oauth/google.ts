import { TokenResponse as GoogleTokenResponse } from '@react-oauth/google';
import { Tag } from 'core';
import { AuthTokens } from '~/domain/auth';
import { Viewer } from '~/domain/viewer';
import { router } from '~/interface/kernel/router/mod.router';
import { apiClient } from '~/interface/shared/api-client/mod.api-client';
import { notifications } from '~/interface/shared/lib/notifications';
import { viewerModel } from '../../viewer/model';
import { registrationModel } from '../registration/model';

export const googleLogin = async (
  creds: Pick<GoogleTokenResponse, 'token_type' | 'access_token'>
) => {
  const preparedToken = `${creds.token_type} ${creds.access_token}`;
  const query = await apiClient.query<{
    tokens: AuthTokens;
    user: Viewer;
  }>({
    url: 'auth/google-login',
    method: 'GET',
    headers: {
      oauth: preparedToken,
    },
  });

  if (query.success?.user) {
    viewerModel.upsert(query.success.user);
    router.navigate('/');

    registrationModel.reset();
  } else {
    notifications.oauthFailed();
  }
};

export type GoogleToken = Tag<string, 'google-oauth-token'>;
