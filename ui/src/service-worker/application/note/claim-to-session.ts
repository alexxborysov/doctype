import { NOTE_MESSAGES } from '~/domain/note';
import { LocalDB } from '~/service-worker/infrastructure/db/mod.db';
import { swMessageChannel } from '~/service-worker/infrastructure/message-channel/mod.message-channel';
import { authService } from '~/service-worker/services/auth.service';
import { cloudApi } from './cloud.api';

export async function claimNotesToSession() {
  const db = await LocalDB.getConnection();

  const session = await authService.getSession();
  if (!session?.current) return;

  try {
    const docs = await db.note.toArray();
    if (docs?.length) {
      const unclaimed = docs.filter(({ viewerId }) => !viewerId);

      for (const doc of unclaimed) {
        const created = await cloudApi.create({
          payload: {
            ...doc,
            userId: session.current.id,
          },
        });

        if (created.data?.ok) {
          db.note.update(doc.id, {
            viewerId: session.current.id,
          });
          swMessageChannel.post(NOTE_MESSAGES.SAVED_TO_CLOUD);
        }
      }
    }
  } catch {}
}
