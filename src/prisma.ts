import { PrismaPg } from "@prisma/adapter-pg";

import { DATABASE_URL } from "./constants.js";
import { PrismaClient } from "./generated/prisma/client.js";

const connectionString = DATABASE_URL;

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });
