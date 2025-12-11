import { bot } from "./bot.js";
import { logger } from "./logger.js";
import { prisma } from "./prisma.js";
import { redis } from "./redis.js";

const bootstrap = async () => {
  await bot.start({
    onStart: (botInfo) => {
      logger.info(`https://t.me/${botInfo.username} has been started`);
    }
  });
};

const stop = async (signal: string) => {
  logger.info(`${signal} received, stopping bot...`);
  await bot.stop();
  await prisma.$disconnect();
  await redis.quit();
  process.exit(0);
};

process.on("SIGINT", () => void stop("SIGINT"));
process.on("SIGTERM", () => void stop("SIGTERM"));

await bootstrap();
