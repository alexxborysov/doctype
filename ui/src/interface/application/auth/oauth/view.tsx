import { Button } from '@mantine/core';
import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { Icon } from '~/interface/shared/view/icon';
import { BaseLoader } from '~/interface/shared/view/loader';
import { googleLogin } from './google';

export const GoogleButton = () => {
  const login = useGoogleLogin({
    onSuccess: googleLogin,
  });

  return (
    <Button
      variant="white"
      classNames={{ root: 'hover:bg-zinc-600/20 bg-cyan-500/10 px-4' }}
      size="md"
      onClick={() => login()}
    >
      <div className="flex items-center justify-center">
        <Icon name="google" className="w-5 h-5" />
      </div>
    </Button>
  );
};

export const GithubButton = () => {
  const [loading, setLoading] = useState(false);

  const redirect = () => {
    setLoading(true);
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_APP_CLIENT_ID}`
    );
  };

  return (
    <Button
      variant="white"
      classNames={{ root: 'hover:bg-zinc-600/20 bg-cyan-500/10 px-4' }}
      size="md"
      onClick={redirect}
    >
      {loading ? (
        <BaseLoader color="blue" size="md" />
      ) : (
        <div className="flex items-center justify-center">
          <Icon name="github" className="w-5 h-5 text-white/80" />
        </div>
      )}
    </Button>
  );
};
