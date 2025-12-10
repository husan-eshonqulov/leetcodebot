import { Bot } from "grammy";

import { BOT_TOKEN } from "./constants.js";
import { type PrivateContext } from "./private/index.js";
import { privateChat } from "./private/index.js";

export type BotContext = PrivateContext;

export const bot = new Bot<BotContext>(BOT_TOKEN);

bot.use(privateChat);

bot.on("message:text", async (ctx) => {
  const session = await ctx.session;
  await ctx.reply(session.__language_code ?? "uz");
});
