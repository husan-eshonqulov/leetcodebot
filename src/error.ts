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

export class LeetcodeError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const errorHandler: ErrorHandler<BotContext> = async (err) => {
  const ctx = err.ctx;
  const e = err.error;

  if (e instanceof GrammyError) {
    logger.error("GrammyError: ", { error: e, ctx });
    await safeReply(ctx, ctx.t("error-grammy", { msg: e.message }));
    return;
  }

  if (e instanceof HttpError) {
    logger.error("HttpError: ", { error: e, ctx });
    await safeReply(ctx, ctx.t("error-http", { msg: e.message }));
    return;
  }

  if (e instanceof LeetcodeError) {
    logger.warn("LeetcodeError", { error: e, ctx });
    await safeReply(ctx, ctx.t("error-leetcode", { msg: e.message }));
    return;
  }

  logger.error("Unexpected error: ", { error: e, ctx });
  await safeReply(ctx, ctx.t("error-bot"));
};
