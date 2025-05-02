import Dexie from 'dexie';
import { Note } from '~/domain/note';
import { Viewer } from '~/domain/viewer';
import { type ParsedRequest } from '../lib/request.parser';

export class LocalDB extends Dexie {
  private static self?: LocalDB;
  public static async getConnection() {
    if (!LocalDB.self) {
      const single = new LocalDB();
      LocalDB.self = single;

      await single.open();
    }

    return LocalDB.self!;
  }

  note!: Dexie.Table<Note, string>;

  networkSchedulerRequest!: Dexie.Table<{ id: string; req: ParsedRequest }, string>;
  authTokens!: Dexie.Table<{ id: 'singleton'; access: string; refresh: string }, string>;

  session!: Dexie.Table<{ id: 'singleton'; current: Viewer }>;

  private constructor() {
    super('main_db');

    this.version(1).stores({
      note: '&id, userId, lastUpdatedTime, name, source',

      networkSchedulerRequest: '&id, req',
      authTokens: '&id, access, refresh',

      session: '&id, current',
    });
  }
}
