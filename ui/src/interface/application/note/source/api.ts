import { Note, NoteId } from '~/domain/note';
import { apiClient } from '~/interface/shared/api-client/mod.api-client';

export const api = {
  async getById({ id }: { id: NoteId }) {
    return apiClient.query<{ ok: boolean; note: Note }>({
      url: 'note/getById',
      method: 'POST',
      data: {
        id,
      },
    });
  },

  async updateSource({ id, source }: Pick<Note, 'id' | 'source'>) {
    return apiClient.query<{ ok: boolean }>({
      url: 'note/updateSource',
      method: 'POST',
      data: {
        id,
        source,
      },
    });
  },
};
