import { HttpStatusCode } from 'axios';
import { makeAutoObservable } from 'mobx';
import { z } from 'zod';
import { ViewerEmail } from '~/domain/viewer';
import { router } from '~/interface/kernel/router/mod.router';
import { createEffect, EffectError } from '~/interface/shared/lib/create-effect';
import { notifications } from '~/interface/shared/lib/notifications';
import { signInViewModel, SignInViewModelInterface } from '~/interface/view/sign-in/model';
import { UNEXPECTED_ERROR_MESSAGE } from '~/service-worker/infrastructure/lib/error-message';
import { LoginDto } from 'core/src';
import { viewerModel, type ViewerModelInterface } from '../../viewer/model';
import { registrationModel, RegistrationModelInterface } from '../registration/model';
import { api } from './api';

class LoginModel {
  constructor(
    private sessionModel: ViewerModelInterface,
    private registrationModel: RegistrationModelInterface,
    private signInViewModel: SignInViewModelInterface
  ) {
    makeAutoObservable(this);
  }

  login = createEffect(async (creds: z.infer<typeof LoginDto>) => {
    const query = await api.login({ data: creds });
    const viewer = query.success?.user;

    if (viewer) {
      this.sessionModel.upsert(viewer);
    }

    const isVerificationNeeded = query.error?.status === HttpStatusCode.UpgradeRequired;
    if (viewer && !isVerificationNeeded) {
      router.navigate('/');
    }

    if (isVerificationNeeded) {
      notifications.notVerifiedAccount();

      this.registrationModel.upsertCredentials({ email: creds.email as ViewerEmail });
      this.registrationModel.changeStep('verification');
      this.signInViewModel.changeTab('registration');
    }

    if (!isVerificationNeeded && query.error) {
      throw new EffectError({
        message: query.error?.response?.data?.message || UNEXPECTED_ERROR_MESSAGE,
      });
    }
  });
}

export const loginModel = new LoginModel(viewerModel, registrationModel, signInViewModel);
