import { Option } from 'core';
import { makeAutoObservable } from 'mobx';
import { AUTH_MESSAGES } from '~/domain/auth';
import { Viewer } from '~/domain/viewer';
import { createEffect } from '~/interface/shared/lib/create-effect';
import { notifications } from '~/interface/shared/lib/notifications';
import { handleGithubRedirection } from '../auth/oauth/github';
import { api } from './api';

class ViewerModel {
  viewer: Option<Viewer> = null;

  constructor() {
    makeAutoObservable(this);
    this.init.run();
  }

  init = createEffect(async () => {
    await handleGithubRedirection();
    await this.defineSession.run();

    window.addEventListener('online', () => {
      this.defineSession.run();
    });
  });

  upsert(payload: Viewer) {
    this.viewer = payload;
  }

  logout() {
    this.viewer = null;
    navigator.serviceWorker.controller?.postMessage(AUTH_MESSAGES.LOGOUT);
  }

  defineSession = createEffect(async () => {
    const query = await api.getSession();

    if (query.success?.viewer) {
      this.upsert(query.success.viewer);
    } else {
      notifications.showCloudSyncReminder();
    }
  });
}

export const viewerModel = new ViewerModel();

export type ViewerModelInterface = ViewerModel;
