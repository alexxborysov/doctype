import { About } from '~/interface/routes/about';
import { AccessDenied } from '~/interface/routes/auth/access-denied';
import { Settings } from '~/interface/routes/auth/settings';
import { SignIn } from '~/interface/routes/auth/sign-in';
import { Editor } from '~/interface/routes/editor';
import { Home } from '~/interface/routes/home';
import { withGuard } from './with-guard';

export const Pages = {
  Home,
  About,
  SignIn,
  AccessDenied,
  Editor,
  Settings: withGuard(Settings, ['USER']),
};
