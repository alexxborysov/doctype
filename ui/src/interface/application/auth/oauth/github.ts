import { logger } from '~/interface/kernel/analytics/logger';
import { router } from '~/interface/kernel/router/mod.router';
import { apiClient } from '~/interface/shared/api-client/mod.api-client';

export async function handleGithubRedirection() {
  if (new URLSearchParams(window.location.search).has('github-auth-verified')) {
    const { error } = await apiClient.query({
      url: 'auth/exchange-github-token',
      method: 'GET',
    });

    if (error) {
      logger.error('GitHub OAuth login failed', {
        tags: {
          feature: 'authentication',
        },
        extra: {
          error,
        },
      });
    }

    router.navigate('/');
  }
}
