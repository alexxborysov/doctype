import type { User } from '@prisma/client';
import { SignUpDto } from 'core';
import { makeAutoObservable } from 'mobx';
import { z } from 'zod';
import { createEffect, EffectError } from '~/interface/shared/lib/create-effect';
import { notifications } from '~/interface/shared/lib/notifications';
import { signInViewModel, SignInViewModelInterface } from '~/interface/view/sign-in/model';
import { api } from './api';
import { Step } from './types';
import { VerificationSchema } from './validation';

class RegistrationModel {
  step: Step = 'receiving-credentials';
  credentials?: Partial<User>;

  constructor(private signInViewModel: SignInViewModelInterface) {
    makeAutoObservable(this);
  }

  changeStep(payload: Step) {
    this.step = payload;
  }

  upsertCredentials(payload: Partial<User>) {
    this.credentials = payload;
  }

  reset() {
    this.step = 'receiving-credentials';
    this.credentials = undefined;
  }

  signUp = createEffect(async (creds: z.infer<typeof SignUpDto>) => {
    const query = await api.signUp({ data: creds });

    if (query?.success) {
      this.upsertCredentials(query.success.createdUser);
      this.changeStep('verification');
    } else {
      throw new EffectError(query.error?.response?.data.message);
    }
  });

  verify = createEffect(async (payload: z.infer<typeof VerificationSchema>) => {
    const query = await api.verify({
      data: { code: payload.code, email: this.credentials?.email ?? '' },
    });

    if (query.success) {
      notifications.accountCreated();

      this.signInViewModel.changeTab('log-in');
      this.changeStep('receiving-credentials');
    } else {
      throw new EffectError(query.error?.response?.data.message);
    }
  });
}

export const registrationModel = new RegistrationModel(signInViewModel);

export type RegistrationModelInterface = RegistrationModel;
