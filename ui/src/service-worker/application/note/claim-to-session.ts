import { NOTE_MESSAGES } from '~/domain/note';
import { LocalDB } from '~/service-worker/infrastructure/db/mod.db';
import { swMessageChannel } from '~/service-worker/infrastructure/message-channel/mod.message-channel';
import { authService } from '~/service-worker/services/auth.service';
import { cloudApi } from './cloud.api';

export async function claimNotesToSession() {
  const db = await LocalDB.getConnection();
  const viewer = await authService.getSession();

  if (!viewer?.current || !db) return;

  try {
    const notes = await db.note.toArray();
    if (notes?.length) {
      const unclaimed = notes.filter(({ userId }) => !userId);

      for (const unclaimedNote of unclaimed) {
        const created = await cloudApi.create({
          payload: {
            ...unclaimedNote,
            userId: viewer.current.id,
          },
        });

        if (created.success?.ok) {
          db.note.update(unclaimedNote.id, {
            userId: viewer.current.id,
          });
          swMessageChannel.post(NOTE_MESSAGES.SAVED_TO_CLOUD);
        }
      }
    }
  } catch {}
}
