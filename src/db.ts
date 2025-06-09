import { PrismaClient } from "@prisma/client";
import { StorageAdapter } from "grammy";
import { createClient, RedisClientType } from "redis";

import { REDIS_URL } from "./constants.js";
import { GroupChatSession, PrivateChatSession } from "./types.js";

export const prisma = new PrismaClient();
export const redis: RedisClientType = createClient({ url: REDIS_URL });
await redis.connect();

export class RedisJSONAdapter<T extends PrivateChatSession | GroupChatSession>
  implements StorageAdapter<T>
{
  constructor(private readonly redis: RedisClientType) {}

  async read(key: string) {
    const value = await this.redis.json.get(key);

    if (!value) return undefined;

    if (typeof value === "string") {
      return JSON.parse(value) as T;
    }

    return value as T;
  }

  async write(key: string, value: T) {
    await this.redis.json.set(key, "$", value);
  }

  async delete(key: string) {
    await this.redis.json.del(key);
  }
}
