import compose from 'compose-function';
import { WithGoogleOAuth } from './with-google-oauth';
import { WithMantine } from './with-mantine';
import { WithMotion } from './with-motion';

export const WithProviders = compose(WithMantine, WithMotion, WithGoogleOAuth);
