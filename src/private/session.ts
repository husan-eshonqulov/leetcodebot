import { RedisAdapter } from "@grammyjs/storage-redis";
import { lazySession, type LazySessionFlavor } from "grammy";

import { redis } from "../redis.js";
import { PrivateContext } from "./index.js";

interface PrivateSessionData {
  locale?: string;
  profile?: string;
  initialized?: boolean;
}

export type PrivateSession = LazySessionFlavor<PrivateSessionData>;

export const privateSession = lazySession<PrivateSessionData, PrivateContext>({
  initial: () => ({}),
  prefix: "session-",
  storage: new RedisAdapter({ instance: redis })
});
