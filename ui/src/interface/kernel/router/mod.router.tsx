import { createBrowserRouter } from 'react-router-dom';
import { BaseLayout } from '~/interface/view/layouts/base';
import { Pages } from './pages';

export const router = createBrowserRouter([
  {
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: <Pages.Home />,
      },
      {
        path: '/notes/:noteId',
        element: <Pages.Editor />,
      },

      {
        path: '/sign-in',
        element: <Pages.SignIn />,
      },

      {
        path: '/about',
        element: <Pages.About />,
      },
    ],
    errorElement: <Pages.AccessDenied />,
  },
  {
    path: '/access-denied',
    element: <Pages.AccessDenied />,
  },
]);
