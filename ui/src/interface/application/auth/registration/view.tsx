import { observer } from 'mobx-react-lite';
import { z } from 'zod';
import { Form } from '~/interface/shared/view/form';
import { Input } from '~/interface/shared/view/input';
import { GithubButton, GoogleButton } from '../oauth/view';
import { registrationModel } from './model';
import { SignUpSchema, VerificationSchema } from './validation';

export const Registration = observer(() => {
  if (registrationModel.step === 'receiving-credentials') {
    return <SignUpForm />;
  } else {
    return <VerificationForm />;
  }
});

const SignUpForm = observer(() => {
  const handleSubmit = async (credentials: z.infer<typeof SignUpSchema>) => {
    Reflect.deleteProperty(credentials, 'confirm');
    registrationModel.signUp.run(credentials);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      schema={SignUpSchema}
      errorMessage={registrationModel.signUp.meta.error?.payload?.message}
      isLoading={registrationModel.signUp.meta.status === 'pending'}
      submitText="Register"
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
      <Input name="confirm" type="password" label="Confirm a password" />
    </Form>
  );
});

const VerificationForm = observer(() => {
  const handleSubmit = async (payload: z.infer<typeof VerificationSchema>) => {
    registrationModel.verify.run(payload);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      schema={VerificationSchema}
      isLoading={registrationModel.verify.meta.status === 'pending'}
      errorMessage={registrationModel.verify.meta.error?.payload?.message}
      submitText="Apply"
      className="w-full"
      leftSubmitSlot={
        <section className="flex items-center justify-center gap-x-4">
          <GoogleButton />
          <GithubButton />
        </section>
      }
    >
      <p className="-mb-2 text-[0.95rem]">
        <span> We've sent you a code! Please, check your </span>
        <a href="https://gmail.com" target="_blank" rel="noreferrer" className="text-cyan-500">
          email!
        </a>
      </p>

      <Input name="code" label="Verification code" />
    </Form>
  );
});
