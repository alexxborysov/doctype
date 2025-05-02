import { Option } from 'core';
import { makeAutoObservable, runInAction } from 'mobx';
import { Note, NoteId, NoteName } from '~/domain/note';
import { createEffect } from '~/interface/shared/lib/create-effect';
import { notifications } from '~/interface/shared/lib/notifications';
import { notesManagerModel, NoteManagerModelInterface } from '../manager/model';
import { api } from './api';

export class NoteRenameModel {
  process: Option<{
    id: NoteId;
    input: NoteName;
    initial: NoteName;
  }> = null;

  constructor(private noteManagerModel: NoteManagerModelInterface) {
    makeAutoObservable(this);
  }

  start(note: Note) {
    this.process = {
      id: note.id,
      initial: note.name,
      input: note.name,
    };
  }

  update(payload: Pick<Note, 'name'>) {
    const currentProcess = this.process;
    if (currentProcess) {
      runInAction(() => {
        this.process = {
          ...currentProcess,
          input: payload.name,
        };
      });
    }
  }

  apply = createEffect(async () => {
    const isDirty = this.process?.initial !== this.process?.input;
    const canApply = this.process && isDirty;

    if (canApply) {
      const preparedName = this.process!.input?.length
        ? (this.process!.input.trim() as NoteName)
        : (this.process!.initial as NoteName);
      const renameQuery = await api.rename({
        data: {
          id: this.process!.id,
          name: preparedName,
        },
      });

      if (renameQuery.success?.ok) {
        await this.noteManagerModel.pull.run();
      } else {
        notifications.noteNotRenamed();
      }
    }

    runInAction(() => {
      this.process = null;
    });
  });
}

export const noteRenameModel = new NoteRenameModel(notesManagerModel);
