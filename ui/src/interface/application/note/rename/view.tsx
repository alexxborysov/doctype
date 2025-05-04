import { TextInput } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useEffect, type ChangeEvent } from 'react';
import { Note, NoteName } from '~/domain/note';
import { noteRenameModel } from './model';

export const Name = observer((note: Note) => {
  const process = noteRenameModel.state;

  const inputNodeRef = useClickOutside(() => {
    noteRenameModel.apply.run();
  });

  const start = async () => {
    const processing = Boolean(process);
    if (processing) {
      await noteRenameModel.apply.run();
    }

    noteRenameModel.start(note);
  };
  const update = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.currentTarget.value as NoteName;
    noteRenameModel.update({ name });
  };

  useEffect(() => {
    if (process && inputNodeRef.current) {
      const caretPosition = process.initialName.length;
      inputNodeRef.current.setSelectionRange(caretPosition, caretPosition);
    }
  }, [process?.noteId]);

  if (process?.noteId === note.id) {
    return (
      <TextInput
        ref={inputNodeRef}
        value={process.enteredName}
        onChange={update}
        onKeyDown={(event) => {
          if (event.key === 'Escape' || event.key === 'Enter') {
            noteRenameModel.apply.run();
          }
        }}
        classNames={{
          input:
            'leading-4 text-center focus:border-black/20 focus:border-solid max-w-[15.5rem] w-[15.5rem] text-sm min-h-0 h-[1.48rem] px-2 rounded',
        }}
        size="xs"
        autoFocus
      />
    );
  } else {
    return (
      <div
        className="text-sm flex items-center h-[1.48rem] w-[15.5rem] max-w-[15.5rem] hover:border-dashed hover:border-spacing-4 hover:border-[1px] border-gray-400/45 box-border rounded-sm truncate px-2 hover:px-[7px]"
        onClick={start}
      >
        <span className="truncate text-center w-full">{note.name}</span>
      </div>
    );
  }
});
