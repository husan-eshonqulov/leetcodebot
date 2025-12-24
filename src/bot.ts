import { Bot } from "grammy";

import { BOT_TOKEN } from "./constants.js";
import { errorHandler } from "./error.js";
import { privateChat, type PrivateContext } from "./private/index.js";

export type BotContext = PrivateContext;

export const bot = new Bot<BotContext>(BOT_TOKEN);

bot.chatType("private", privateChat);

bot.on("message:text", async (ctx) => {
  await ctx.reply("echo");
});

bot.catch(errorHandler);
