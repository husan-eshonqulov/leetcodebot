import { Redis } from "ioredis";

import { REDIS_URL } from "./constants.js";
import { logger } from "./logger.js";

export const redis = new Redis(REDIS_URL);

redis.on("error", (err) => logger.error("Redis error", { error: err }));
