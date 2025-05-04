import { observer } from 'mobx-react-lite';
import { type FunctionComponent } from 'react';
import { Navigate } from 'react-router-dom';
import type { ViewerRole } from '~/domain/viewer';
import { viewerModel } from '~/interface/application/viewer/model';
import { RoutePath } from '~/interface/shared/types/common';
import { BaseLoader } from '~/interface/shared/view/loader';

const SUPER_ROLES = [] satisfies ViewerRole[];

export function withAuthGuard(
  Component: FunctionComponent,
  permissibleRoles: ExcludeStrict<ViewerRole, (typeof SUPER_ROLES)[number]>[],
  redirectTo?: RoutePath
) {
  return observer(function RouteElement(props: Record<string, unknown>) {
    const viewer = viewerModel.viewer;

    if (!viewer?.role || !isAccessGranted(viewer.role, permissibleRoles)) {
      return <Navigate to={redirectTo || '/access-denied'} replace />;
    }

    return <Component {...props} />;
  });
}

function isAccessGranted(
  viewerRole: ViewerRole,
  permissibleRoles: ExcludeStrict<ViewerRole, (typeof SUPER_ROLES)[number]>[]
) {
  const allPermissibleRoles = [...SUPER_ROLES, ...permissibleRoles];
  return allPermissibleRoles.some((role) => role === viewerRole);
}

export function withGuestGuard(Component: FunctionComponent, redirectTo?: RoutePath) {
  return observer(function RouteElement(props: Record<string, unknown>) {
    const viewer = viewerModel.viewer;

    if (viewerModel.init.meta.status !== 'fulfilled') {
      return <BaseLoader position="centered" className="fixed top-1/2 left-1/2 -mt-[4dvh]" />;
    }

    if (viewer) {
      return <Navigate to={redirectTo || '/'} replace />;
    }

    return <Component {...props} />;
  });
}
