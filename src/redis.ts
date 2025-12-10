import { Redis } from "ioredis";

import { REDIS_URL } from "./constants.js";

export const redis = new Redis(REDIS_URL);
