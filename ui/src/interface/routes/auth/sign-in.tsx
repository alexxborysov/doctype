import { lazy, Suspense } from 'react';
import { BaseLoader } from '~/interface/shared/view/loader';
import { Transition } from '~/interface/shared/view/transition';

const SignInView = lazy(async () =>
  import('~/interface/view/sign-in/view').then((mod) => ({ default: mod.SignIn }))
);

export const SignIn = () => {
  return (
    <main className="w-full min-h-[95vh] flex flex-row justify-center pt-[25dvh]">
      <Suspense fallback={<BaseLoader className="fixed bottom-4 right-5" />}>
        <Transition className="w-full max-w-[540px] px-4">
          <SignInView />
        </Transition>
      </Suspense>
    </main>
  );
};
