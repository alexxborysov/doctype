import { NETWORK_MESSAGES } from '~/interface/kernel/network/messages';
import { generateId } from 'core/src/lib/generate-id';
import { AnyPayload, swApiClient } from '../api-client/mod.api-client';
import { LocalDB } from '../db/mod.db';
import { parseRequestInstance } from '../lib/request.parser';
import { swMessageChannel } from '../message-channel/mod.message-channel';
import { isNetworkError } from './is-network-error';

const LATEST_ONLY_STRATEGY_ROUTES = ['note/updateSource'];

const storage = {
  get: async () => {
    const db = await LocalDB.getConnection();
    return db.networkSchedulerRequest.toArray();
  },
  add: async ({ req, payload }: { req: Request; payload?: AnyPayload }) => {
    const db = await LocalDB.getConnection();

    const cleanupRequired = LATEST_ONLY_STRATEGY_ROUTES.find((route) => {
      return req.url.includes(route);
    });

    if (cleanupRequired) {
      const stale = await db.networkSchedulerRequest
        .filter(({ req }) => {
          return Boolean(req.url?.includes(cleanupRequired));
        })
        .toArray();

      await db.networkSchedulerRequest.bulkDelete(stale.map((record) => record.id));
    }

    await db.networkSchedulerRequest.add({
      id: generateId(),
      req: parseRequestInstance(req, payload),
    });
  },
};

async function post({ req, payload }: { req: Request; payload: AnyPayload }) {
  await storage.add({ req, payload });
  await execute();
}

async function execute() {
  if (navigator.onLine) {
    const db = await LocalDB.getConnection();

    const queue = await storage.get();
    const succeed = [];

    if (queue.length) {
      for (const { req, id } of queue) {
        const response = await swApiClient.query<any>({
          parsedRequest: req,
        });

        if (!isNetworkError(response.error)) {
          succeed.push(id);
        }
      }

      await db.networkSchedulerRequest.bulkDelete(succeed).catch(() => {});
    }
  }
}

export const networkScheduler = {
  post,
  execute,
};

swMessageChannel.on(NETWORK_MESSAGES.ONLINE, () => {
  networkScheduler.execute();
});
