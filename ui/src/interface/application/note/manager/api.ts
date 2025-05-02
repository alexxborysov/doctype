import { Note } from '~/domain/note';
import { apiClient } from '~/interface/shared/api-client/mod.api-client';

export const api = {
  async create({ data }: { data: OmitStrict<Note, 'lastUpdatedTime' | 'id' | 'viewerId'> }) {
    return apiClient.query<{ ok: boolean }>({
      url: 'note/create',
      method: 'POST',
      data,
    });
  },

  async remove({ data }: { data: Pick<Note, 'id'> }) {
    return apiClient.query<{ ok: boolean }>({
      url: 'note/remove',
      method: 'POST',
      data,
    });
  },

  async pull() {
    return apiClient.query<{ ok: boolean; items: Note[] }>({
      url: 'note/pull',
      method: 'GET',
    });
  },

  async pullCloud() {
    return apiClient.query<{ ok: boolean; items: Note[]; updated: boolean }>({
      url: 'note/pullCloud',
      method: 'GET',
    });
  },
};
