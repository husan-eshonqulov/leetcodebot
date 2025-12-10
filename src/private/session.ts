import { RedisAdapter } from "@grammyjs/storage-redis";
import { Context, lazySession, LazySessionFlavor } from "grammy";
import { Redis } from "ioredis";

import { REDIS_URL } from "../constants.js";

interface PrivateSessionData {
  __language_code?: string;
}

const redis = new Redis(REDIS_URL);

export type PrivateSession = LazySessionFlavor<PrivateSessionData>;

export const privateSession = <C extends Context>() =>
  lazySession<PrivateSessionData, C>({
    initial: () => ({}),
    storage: new RedisAdapter({ instance: redis })
  });
