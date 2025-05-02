import { RouterProvider } from 'react-router-dom';
import { WithProviders } from './providers/compose';
import { router } from './router/mod.router';

export const ComposedApp = WithProviders(() => <RouterProvider router={router} />);
