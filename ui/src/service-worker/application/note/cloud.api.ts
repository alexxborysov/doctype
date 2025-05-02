import { z } from 'zod';
import { Note } from '~/domain/note';
import { swApiClient } from '~/service-worker/infrastructure/api-client/mod.api-client';
import { NoteStrictSchema } from 'core/src/dto/note.dto';

export const cloudApi = {
  async getRemotelyStored() {
    return swApiClient.query<{ ok: boolean; items: Note[] }>({
      parsedRequest: {
        url: 'note/get',
        method: 'GET',
      },
    });
  },

  async create({ payload }: { payload: z.infer<typeof NoteStrictSchema> }) {
    return swApiClient.query<{ ok: boolean }>({
      parsedRequest: {
        url: 'note/create',
        method: 'POST',
        payload,
      },
    });
  },
};
