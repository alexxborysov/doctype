import { Note } from '~/domain/note';
import { apiClient } from '~/interface/shared/api-client/mod.api-client';

export const api = {
  async rename({ data }: { data: Pick<Note, 'name' | 'id'> }) {
    return apiClient.query<{ ok: boolean }>({
      url: 'note/rename',
      method: 'POST',
      data,
    });
  },
};
