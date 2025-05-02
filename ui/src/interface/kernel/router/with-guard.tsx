import type { FunctionComponent } from 'react';
import { Navigate } from 'react-router-dom';
import type { ViewerRole } from '~/domain/viewer';
import { viewerModel } from '~/interface/application/viewer/model';
import { RoutePath } from '~/interface/shared/types/common';

const SUPER_ROLES = [] satisfies ViewerRole[];

export function withGuard(
  Component: FunctionComponent,
  permissibleRoles: ExcludeStrict<ViewerRole, (typeof SUPER_ROLES)[number]>[],
  redirectTo?: RoutePath
) {
  return function RouteElement(props: Record<string, unknown>) {
    const viewer = viewerModel.viewer;

    if (!viewer?.role || !isAccessGranted(viewer.role, permissibleRoles)) {
      return <Navigate to={redirectTo || '/access-denied'} replace />;
    }

    return <Component {...props} />;
  };
}

function isAccessGranted(
  viewerRole: ViewerRole,
  permissibleRoles: ExcludeStrict<ViewerRole, (typeof SUPER_ROLES)[number]>[]
) {
  const allPermissibleRoles = [...SUPER_ROLES, ...permissibleRoles];
  return allPermissibleRoles.some((role) => role === viewerRole);
}
