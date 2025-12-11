import { type ErrorHandler, GrammyError, HttpError } from "grammy";

import { type BotContext } from "./bot.js";
import { logger } from "./logger.js";

export const errorHandler: ErrorHandler<BotContext> = async (err) => {
  const ctx = err.ctx;
  const e = err.error;

  if (e instanceof GrammyError) {
    logger.error("GrammyError: ", e);
    await ctx.reply(ctx.t("error-grammy", { msg: e.message }));
  } else if (e instanceof HttpError) {
    logger.error("HttpError: ", e);
    await ctx.reply(ctx.t("error-http", { msg: e.message }));
  } else {
    logger.error("BotError: ", e);
    await ctx.reply(ctx.t("error-bot"));
  }
};
