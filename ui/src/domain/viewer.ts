import type { User } from '@prisma/client';
import type { Tag } from 'core/src';

export type Viewer = Tag<
  {
    id: ViewerId;
    email: ViewerEmail;
    role: ViewerRole;
    verified: ViewerVerified;
  },
  'viewer'
>;

export type ViewerId = Tag<User['id'], 'viewer-id'>;
export type ViewerEmail = Tag<User['email'], 'viewer-email'>;
export type ViewerRole = User['role'];
export type ViewerVerified = Tag<User['verified'], 'viewer-verified'>;
