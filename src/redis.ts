import { Redis } from "ioredis";

import { REDIS_URL } from "./constants.js";
import { logger } from "./logger.js";

export const redis = new Redis(REDIS_URL);

redis.on("ready", () => logger.info("Redis ready"));
redis.on("error", (error) => logger.error("Redis error", { error }));
redis.on("close", () => logger.warn("Redis connection closed"));
