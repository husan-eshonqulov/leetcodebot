import { RedisAdapter } from "@grammyjs/storage-redis";
import { Context, lazySession, LazySessionFlavor } from "grammy";

import { redis } from "../redis.js";

interface PrivateSessionData {
  __language_code?: string;
}

export type PrivateSession = LazySessionFlavor<PrivateSessionData>;

export const privateSession = <C extends Context>() =>
  lazySession<PrivateSessionData, C>({
    initial: () => ({}),
    storage: new RedisAdapter({ instance: redis })
  });
