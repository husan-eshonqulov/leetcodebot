import { RedisAdapter } from "@grammyjs/storage-redis";
import { type Context, lazySession, type LazySessionFlavor } from "grammy";

import { redis } from "../redis.js";

interface PrivateSessionData {
  __language_code?: string;
  admin?: boolean;
  created?: boolean;
}

export type PrivateSession = LazySessionFlavor<PrivateSessionData>;

export const privateSession = <C extends Context>() =>
  lazySession<PrivateSessionData, C>({
    initial: () => ({}),
    storage: new RedisAdapter({ instance: redis })
  });
