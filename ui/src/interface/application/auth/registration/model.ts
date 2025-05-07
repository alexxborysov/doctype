import { Option, SignUpDto } from 'core';
import { makeAutoObservable } from 'mobx';
import { z } from 'zod';
import { ViewerEmail } from '~/domain/viewer';
import { logger } from '~/interface/kernel/analytics/logger';
import { createEffect, EffectError } from '~/interface/shared/lib/create-effect';
import { notifications } from '~/interface/shared/lib/notifications';
import { signInViewModel, SignInViewModelInterface } from '~/interface/view/sign-in/model';
import { UNEXPECTED_ERROR_MESSAGE } from '~/service-worker/infrastructure/lib/error-message';
import { api } from './api';
import { Step } from './types';
import { VerificationSchema } from './validation';

type Credentials = {
  email: ViewerEmail;
  password?: Option<string>;
};

class RegistrationModel {
  step: Step = 'receiving-credentials';
  credentialsInProcess: Option<Credentials> = null;

  constructor(private signInViewModel: SignInViewModelInterface) {
    makeAutoObservable(this);
  }

  changeStep(payload: Step) {
    this.step = payload;
  }

  upsertCredentials(credentials: Credentials) {
    this.credentialsInProcess = credentials;
  }

  reset() {
    this.step = 'receiving-credentials';
    this.credentialsInProcess = null;
  }

  signUp = createEffect(async (creds: z.infer<typeof SignUpDto>) => {
    const query = await api.signUp({ data: creds });

    if (query?.success?.createdUser) {
      const createdUser = query.success.createdUser;
      this.upsertCredentials({ email: createdUser.email });
      this.changeStep('verification');
    } else {
      logger.error('Registration failed', {
        tags: {
          feature: 'authorization',
        },
        extra: {
          query,
        },
      });
      throw new EffectError({
        message: query.error?.response?.data.message || UNEXPECTED_ERROR_MESSAGE,
      });
    }
  });

  verify = createEffect(async (payload: z.infer<typeof VerificationSchema>) => {
    const query = await api.verify({
      data: { code: payload.code, email: this.credentialsInProcess?.email ?? '' },
    });

    if (query.success) {
      notifications.accountCreated();

      this.signInViewModel.changeTab('log-in');
      this.changeStep('receiving-credentials');
    } else {
      logger.error('Email verification failed', {
        tags: {
          feature: 'authorization',
        },
        extra: {
          query,
        },
      });
      throw new EffectError({
        message: query.error?.response?.data.message || UNEXPECTED_ERROR_MESSAGE,
      });
    }
  });
}

export const registrationModel = new RegistrationModel(signInViewModel);

export type RegistrationModelInterface = RegistrationModel;
