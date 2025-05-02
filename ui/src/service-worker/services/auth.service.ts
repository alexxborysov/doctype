import { AUTH_MESSAGES, AuthTokens } from '~/domain/auth';
import { Viewer } from '~/domain/viewer';
import { LocalDB } from '../infrastructure/db/mod.db';
import { swMessageChannel } from '../infrastructure/message-channel/mod.message-channel';

export const authService = {
  async updateTokens({ access, refresh }: AuthTokens) {
    const db = await LocalDB.getConnection();

    try {
      const singleton = await db.authTokens.get('singleton');

      if (!singleton) {
        await db.authTokens.add({ id: 'singleton', access, refresh });
      } else {
        await db.authTokens.update('singleton', {
          access,
          refresh,
        });
      }
    } catch {}
  },
  async getTokens() {
    const db = await LocalDB.getConnection();
    return await db.authTokens.get('singleton').catch(() => null);
  },
  async removeTokens() {
    const db = await LocalDB.getConnection();
    await db.authTokens.delete('singleton').catch(() => {});
  },

  async updateSession({ viewer }: { viewer: Viewer }) {
    const db = await LocalDB.getConnection();

    try {
      const singleton = await db.session.get('singleton');

      if (!singleton) {
        await db.session.add({ id: 'singleton', current: viewer });
      } else {
        await db.session.update('singleton', {
          current: viewer,
        });
      }

      swMessageChannel.post(AUTH_MESSAGES.SESSION_UPDATED);
    } catch {}
  },
  async getSession() {
    const db = await LocalDB.getConnection();
    return await db.session.get('singleton').catch(() => undefined);
  },
  async removeSession() {
    const db = await LocalDB.getConnection();
    return await db.session.delete('singleton').catch(() => {});
  },
};

swMessageChannel.on(AUTH_MESSAGES.LOGOUT, () => {
  authService.removeTokens();
  authService.removeSession();
});
