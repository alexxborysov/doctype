import { Option } from 'core';
import dayjs from 'dayjs';
import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { Note, NOTE_MESSAGES, NoteId, NoteName, NoteSource } from '~/domain/note';
import { serviceWorkerState } from '~/interface/kernel/network/sw-state';
import { createEffect, EffectError } from '~/interface/shared/lib/create-effect';
import { notifications } from '~/interface/shared/lib/notifications';
import { messageChannel } from '~/interface/shared/message-channel/mod.message-channel';
import { DEVELOPMENT_TEMPLATE } from '~/interface/view/editor/templates/development.template';
import { DEVOPS_DEPLOY_TEMPLATE } from '~/interface/view/editor/templates/devops.template';
import { getDefaultNoteTemplate } from '~/interface/view/editor/templates/note.template';
import { viewerModel, ViewerModelInterface } from '../../viewer/model';
import { api } from './api';

class NotesManagerModel {
  pool: Note[] = [];
  lasOpenedNoteId: Option<NoteId> = null;

  constructor(private viewerModel: ViewerModelInterface) {
    makeAutoObservable(this);
    this.init.run();
  }

  init = createEffect(async () => {
    await serviceWorkerState.activated;

    this.pull.run();
    runInAction(() => {
      this.lasOpenedNoteId = lastOpened.get();
    });

    reaction(
      () => this.viewerModel.viewer,
      () => this.pullCloud.run()
    );
  });

  create = createEffect(async (payload?: Pick<Note, 'name' | 'source'> | void) => {
    const name = payload?.name ?? generateNoteName();
    const note = {
      name,
      source: payload?.source ?? getDefaultNoteTemplate({ name, date: dayjs().toString() }),
    } as Note;
    const createQuery = await api.create({
      data: note,
    });

    if (createQuery.success?.ok) {
      this.pull.run();
    } else {
      notifications.noteNotCreated();
    }
  });

  remove = createEffect(async (meta: { id: Note['id'] }) => {
    const query = await api.remove({
      data: meta,
    });

    if (query.success?.ok) {
      this.pull.run();
    } else {
      notifications.noteNotRemoved();
    }
  });

  pull = createEffect(async () => {
    const query = await api.pull();

    if (query.success?.items) {
      runInAction(() => {
        this.pool = query.success!.items;
      });
    } else {
      throw new EffectError(query.error?.response?.data.message);
    }
  });

  pullCloud = createEffect(async () => {
    const session = this.viewerModel.viewer;
    if (!session) {
      throw new EffectError('session is not defined');
    }

    const query = await api.pullCloud();
    if (query.success?.ok && query.success.updated) {
      runInAction(() => {
        this.pool = query.success!.items;
      });
      notifications.receivedCloudUpdates();
    } else {
      throw new EffectError(query.error?.response?.data.message);
    }
  });

  setLastOpenedNote(id: Note['id']) {
    this.lasOpenedNoteId = id;
    lastOpened.set(id);
  }

  generateSample = createEffect(async () => {
    this.create.run(SAMPLE_TEMPLATES.Development);
    this.create.run(SAMPLE_TEMPLATES.DevOps);
  });
}

messageChannel.on(NOTE_MESSAGES.SAVED_TO_CLOUD, () => {
  notifications.progressSavedToCloud();
});

export const lastOpened = {
  __tag: 'last-opened-note-id',
  get() {
    return localStorage.getItem(lastOpened.__tag) as NoteId;
  },
  set(id: NoteId) {
    return localStorage.setItem(lastOpened.__tag, id);
  },
};

export function generateNoteName() {
  return ('Note: ' + '~' + dayjs().format('ss').toString()) as NoteName;
}

export const notesManagerModel = new NotesManagerModel(viewerModel);

export const SAMPLE_TEMPLATES = {
  Development: {
    name: 'Development' as NoteName,
    source: DEVELOPMENT_TEMPLATE as NoteSource,
  },
  DevOps: {
    name: 'DevOps: Deploy Notes' as NoteName,
    source: DEVOPS_DEPLOY_TEMPLATE as NoteSource,
  },
};

export type NoteManagerModelInterface = NotesManagerModel;
