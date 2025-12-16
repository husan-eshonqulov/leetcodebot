import { bot } from "./bot.js";
import { locales, validateLocales } from "./i18n.js";
import { logger } from "./logger.js";
import { prisma } from "./prisma.js";
import { redis } from "./redis.js";

const shutdown = async (signal: string) => {
  logger.info(`${signal} received, shutting down bot...`);
  await bot.stop();
  await prisma.$disconnect();
  await redis.quit();
  process.exit(0);
};

const shutdownErrorHandler = (error: unknown) => {
  logger.error("Error during shutdown: ", { error });
  process.exit(1);
};

const bootstrap = async () => {
  validateLocales(locales);

  await prisma.$connect();
  logger.info("Prisma connected");

  process.once("SIGINT", () => {
    shutdown("SIGINT").catch(shutdownErrorHandler);
  });
  process.once("SIGTERM", () => {
    shutdown("SIGTERM").catch(shutdownErrorHandler);
  });

  await bot.start({
    onStart: (botInfo) => {
      logger.info(`https://t.me/${botInfo.username} has been started`);
    }
  });
};

bootstrap().catch((error: unknown) => {
  logger.error("Failed to start bot", { error });
  process.exit(1);
});
