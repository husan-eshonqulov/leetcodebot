import { Bot } from "grammy";

import { BOT_TOKEN } from "./constants.js";
import { i18n } from "./i18n.js";
import { type PrivateContext } from "./private/index.js";
import { privateChat } from "./private/index.js";

export type BotContext = PrivateContext;

export const bot = new Bot<BotContext>(BOT_TOKEN);

bot.use(privateChat);
bot.use(i18n());

bot.on("message:text", async (ctx) => {
  const session = await ctx.session;
  console.log(session);
  await ctx.reply(ctx.t("cmd-start"));
});
