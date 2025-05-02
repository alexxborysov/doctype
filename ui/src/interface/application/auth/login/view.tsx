import { LoginDto } from 'core';
import { observer } from 'mobx-react-lite';
import { z } from 'zod';
import { Form } from '~/interface/shared/view/form';
import { Input } from '~/interface/shared/view/input';
import { GithubButton, GoogleButton } from '../oauth/view';
import { loginModel } from './model';

export const Login = observer(() => {
  const handleLogin = async (credentials: z.infer<typeof LoginDto>) => {
    loginModel.login.run(credentials);
  };

  return (
    <Form
      onSubmit={handleLogin}
      schema={LoginDto}
      submitText="Log In"
      errorMessage={loginModel.login.meta.error?.payload?.message}
      isLoading={loginModel.login.meta.status === 'pending'}
      className="w-full"
      leftSubmitSlot={
        <section className="flex items-center justify-center gap-x-4">
          <GoogleButton />
          <GithubButton />
        </section>
      }
    >
      <Input name="email" type="email" label="Email" />
      <Input name="password" type="password" label="Password" />
    </Form>
  );
});
