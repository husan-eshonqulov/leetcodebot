import { RedisAdapter } from "@grammyjs/storage-redis";
import { Context, lazySession, LazySessionFlavor } from "grammy";

import { redis } from "../redis.js";

interface PrivateSessionData {
  __language_code?: string;
  isAdmin?: boolean;
}

export type PrivateSession = LazySessionFlavor<PrivateSessionData>;

export const privateSession = <C extends Context>() =>
  lazySession<PrivateSessionData, C>({
    initial: () => ({}),
    storage: new RedisAdapter({ instance: redis })
  });
