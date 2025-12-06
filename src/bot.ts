import { Bot } from "grammy";

import { BOT_TOKEN } from "./constants.js";

export const bot = new Bot(BOT_TOKEN);

bot.on("message:text", (ctx) => ctx.reply(ctx.message.text));
