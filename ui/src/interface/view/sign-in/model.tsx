import { makeAutoObservable } from 'mobx';
import { Tab } from './types';

class SignInViewModel {
  tab: Tab = 'registration';
  constructor() {
    makeAutoObservable(this);
  }
  changeTab(payload: Tab) {
    this.tab = payload;
  }
}

export const signInViewModel = new SignInViewModel();

export type SignInViewModelInterface = SignInViewModel;
