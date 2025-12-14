import { type BotCommand } from "@grammyjs/types";
import { type CommandMiddleware } from "grammy";

import { languageMenu } from "../i18n.js";
import { PrivateContext } from "./index.js";

interface Command extends BotCommand {
  handler: CommandMiddleware<PrivateContext>;
}

export const languageCmd: Command = {
  command: "language",
  description: "change language",

  handler: async (ctx) => {
    await ctx.reply(ctx.t("cmd-language"), { reply_markup: languageMenu });
  }
};
