import type { Tag } from 'core/src';
import type { Option } from 'core/src/lib/option';
import type { ViewerId } from './viewer';

export type Note = Tag<
  {
    id: NoteId;
    viewerId: Option<ViewerId>;
    name: NoteName;
    source: NoteSource;
    lastUpdatedTime: LastUpdatedTime;
  },
  'note'
>;

export type NoteId = Tag<string, 'note-id'>;

export type LastUpdatedTime = Tag<string, 'last-updated-time'>;

export type NoteName = Tag<string, 'note-name'>;

export type NoteSource = Tag<string, 'note-source'>;

export const NOTE_MESSAGES = {
  SAVED_TO_CLOUD: 'SAVED_TO_CLOUD',
} as const;
