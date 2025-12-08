import { bot } from "./bot.js";
import { logger } from "./logger.js";

await bot.start({
  onStart: (botInfo) => {
    logger.info(`https://t.me/${botInfo.username} has been started`);
  }
});
