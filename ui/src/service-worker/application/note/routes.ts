import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { LastUpdatedTime, Note } from '~/domain/note';
import { networkScheduler } from '~/service-worker/infrastructure/network-scheduler/mod.network-scheduler';
import { router } from '~/service-worker/infrastructure/router/mod.router';
import {
  prepareErrorResponse,
  prepareResponse,
} from '~/service-worker/infrastructure/router/prepare-response';
import { authService } from '~/service-worker/services/auth.service';
import { NoteSchema } from 'core/src/dto/note.dto';
import { generateId } from 'core/src/lib/generate-id';
import { cloudApi } from './cloud.api';

export function registerNoteRoutes() {
  router.register({
    path: 'note/create',
    handler: async (ev, db) => {
      const body = await ev.request.json();
      const parsedBody = NoteSchema.pick({ name: true, source: true }).parse(body);

      const viewer = await authService.getSession();
      const payload = {
        ...parsedBody,
        id: generateId(),
        lastUpdatedTime: dayjs().toString(),
      } as Note;

      if (viewer?.current) {
        await db.note.add({ ...payload, viewerId: viewer.current.id });
        networkScheduler.post({
          req: ev.request,
          payload: { ...payload, viewerId: viewer.current.id },
        });
      } else {
        await db.note.add(payload);
      }

      return prepareResponse({
        ok: true,
      });
    },
  });

  router.register({
    path: 'note/remove',
    handler: async (ev, db) => {
      const body = await ev.request.json();
      const parsedBody = NoteSchema.pick({ id: true }).parse(body);

      const viewer = await authService.getSession();
      await db.note.delete(parsedBody.id);

      if (viewer?.current?.id) {
        networkScheduler.post({ req: ev.request, payload: parsedBody });
      }

      return prepareResponse({
        ok: true,
      });
    },
  });

  router.register({
    path: 'note/rename',
    handler: async (ev, db) => {
      const body = await ev.request.json();
      const parsedBody = NoteSchema.pick({ name: true, id: true }).parse(body) as Pick<
        Note,
        'id' | 'name'
      >;

      const viewer = await authService.getSession();

      const renamed = await db.note
        .update(parsedBody.id, {
          name: parsedBody.name,
        })
        .catch(() => undefined);

      if (viewer?.current?.id) {
        const cloudReqPayload = {
          id: parsedBody.id,
          name: parsedBody.name,
        } satisfies Pick<Note, 'id' | 'name'>;

        networkScheduler.post({ req: ev.request, payload: cloudReqPayload });
      }

      return prepareResponse({
        ok: Boolean(renamed),
      });
    },
  });

  router.register({
    path: 'note/pull',
    handler: async (_ev, db) => {
      try {
        const notes = await db.note.toArray();
        const sorted = notes?.sort((a, b) => {
          return dayjs(b.lastUpdatedTime).diff(dayjs(a.lastUpdatedTime));
        });

        return prepareResponse({
          ok: true,
          items: sorted,
        });
      } catch {
        return prepareErrorResponse(new AxiosError());
      }
    },
  });

  router.register({
    path: 'note/pullCloud',
    handler: async (_ev, db) => {
      const authTokens = await authService.getTokens();
      if (!navigator.onLine || !authTokens) {
        return prepareResponse({
          ok: false,
        });
      }

      const query = await cloudApi.getRemotelyStored();

      if (query.success?.ok) {
        let updated = false;
        const local = await db.note.toArray();
        const receivedRemotely = query.success.items;

        receivedRemotely.forEach(async (remoteNote) => {
          const localNote = local.find((localNote) => localNote.id === remoteNote.id);
          if (localNote) {
            const upgradeRequired = dayjs(remoteNote.lastUpdatedTime).isAfter(
              localNote.lastUpdatedTime
            );

            if (upgradeRequired) {
              await db.note
                .update(localNote.id, remoteNote)
                .then(() => (updated = true))
                .catch(() => {});
            }
          } else {
            await db.note
              .add(remoteNote)
              .then(() => (updated = true))
              .catch(() => {});
          }
        });

        const merged = (await db.note.toArray()).sort((a, b) => {
          return dayjs(b.lastUpdatedTime).diff(dayjs(a.lastUpdatedTime));
        });

        return prepareResponse({
          ok: true,
          items: merged,
          updated,
        });
      } else {
        return prepareErrorResponse(new AxiosError());
      }
    },
  });

  router.register({
    path: 'note/getById',
    handler: async (ev, db) => {
      const body = await ev.request.json();
      const parsedBody = NoteSchema.pick({ id: true }).parse(body);
      const note = await db.note.get(parsedBody.id);

      if (note) {
        return prepareResponse({
          ok: true,
          note: note,
        });
      } else {
        return prepareErrorResponse(new AxiosError('Note was not found.'));
      }
    },
  });

  router.register({
    path: 'note/updateSource',
    handler: async (ev, db) => {
      const body = await ev.request.json();
      const { id, source } = NoteSchema.pick({ id: true, source: true }).parse(body) as Pick<
        Note,
        'id' | 'source'
      >;

      const viewer = await authService.getSession();
      const now = dayjs().toString() as LastUpdatedTime;

      const updated = await db.note.update(id, {
        source,
        lastUpdatedTime: now,
      });

      if (viewer?.current) {
        networkScheduler.post({
          req: ev.request,
          payload: { id, source, lastUpdatedTime: now },
        });
      }

      if (updated) {
        return prepareResponse({
          ok: true,
        });
      } else {
        return prepareErrorResponse(new AxiosError('Note Source is not updated.'));
      }
    },
  });
}
