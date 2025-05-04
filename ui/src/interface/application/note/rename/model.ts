import type { Option } from 'core';
import { makeAutoObservable } from 'mobx';
import type { Note, NoteId, NoteName } from '~/domain/note';
import { createEffect } from '~/interface/shared/lib/create-effect';
import { notifications } from '~/interface/shared/lib/notifications';
import { notesManagerModel, type NoteManagerModelInterface } from '../manager/model';
import { api } from './api';

export class NoteRenameModel {
  state: Option<{
    noteId: NoteId;
    enteredName: NoteName;
    initialName: NoteName;
  }> = null;

  constructor(private noteManagerModel: NoteManagerModelInterface) {
    makeAutoObservable(this);
  }

  start(note: Note) {
    this.state = {
      noteId: note.id,
      initialName: note.name,
      enteredName: note.name,
    };
  }

  update(payload: Pick<Note, 'name'>) {
    if (this.state) this.state.enteredName = payload.name;
  }

  reset() {
    this.state = null;
  }

  apply = createEffect(async () => {
    const isChanged = this.state?.initialName !== this.state?.enteredName;
    const canApply = this.state && isChanged;

    if (canApply) {
      const preparedName = this.state!.enteredName?.length
        ? (this.state!.enteredName.trim() as NoteName)
        : (this.state!.initialName as NoteName);
      const renameQuery = await api.rename({
        data: {
          id: this.state!.noteId,
          name: preparedName,
        },
      });
      if (renameQuery.success?.ok) {
        await this.noteManagerModel.pull.run();
      } else {
        notifications.noteNotRenamed();
      }
    }

    this.reset();
  });
}

export const noteRenameModel = new NoteRenameModel(notesManagerModel);
