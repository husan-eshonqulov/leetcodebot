import { type ErrorHandler, GrammyError, HttpError } from "grammy";

import { type BotContext } from "./bot.js";
import { logger } from "./logger.js";

const safeReply = async (ctx: BotContext, text: string) => {
  try {
    await ctx.reply(text);
  } catch (err) {
    logger.debug("Reply failed: ", err);
  }
};

export const errorHandler: ErrorHandler<BotContext> = async (err) => {
  const ctx = err.ctx;
  const e = err.error;

  if (e instanceof GrammyError) {
    logger.error("GrammyError: ", { err });
    await safeReply(ctx, ctx.t("error-grammy", { msg: e.message }));
  } else if (e instanceof HttpError) {
    logger.error("HttpError: ", { err });
    await safeReply(ctx, ctx.t("error-http", { msg: e.message }));
  } else {
    logger.error("Unexpected error: ", { err });
    await safeReply(ctx, ctx.t("error-bot"));
  }
};
