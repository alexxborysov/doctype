import dayjs from 'dayjs';
import { NoteSource } from '~/domain/note';
import { DateString } from '~/interface/shared/types/common';

export const getDefaultNoteTemplate = ({ name, date }: { name: string; date: DateString }) => {
  return `
    <h1>${name}</h1><p>The note was created at ${dayjs(date).format('dddd h:mm A').toString()}</p>
  ` as NoteSource;
};
