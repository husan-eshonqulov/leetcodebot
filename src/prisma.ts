import { PrismaPg } from "@prisma/adapter-pg";

import { DATABASE_URL } from "./constants.js";
import { PrismaClient } from "./generated/prisma/client.js";
import { logger } from "./logger.js";

const connectionString = DATABASE_URL;

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({
  adapter,
  log: [
    { emit: "event", level: "error" },
    { emit: "event", level: "warn" }
  ]
});

prisma.$on("error", (err) => logger.error("Prisma error: ", { err }));
prisma.$on("warn", (warn) => logger.warn("Prisma warning: ", { warn }));
