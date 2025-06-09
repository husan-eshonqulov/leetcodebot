import { Bot } from "grammy";

import { BOT_TOKEN } from "./constants.js";
import { commands as groupCommands } from "./groupChat/commands.js";
import { groupChatComposer } from "./groupChat/composer.js";
import { markdownParser, setBotCommands } from "./helpers.js";
import { commands as privateCommands } from "./privateChat/commands.js";
import { privateChatComposer } from "./privateChat/composer.js";
import { BotContext } from "./types.js";

export const bot = new Bot<BotContext>(BOT_TOKEN);

bot.chatType("private").use(privateChatComposer);
bot.chatType(["group", "supergroup"]).use(groupChatComposer);

await setBotCommands([
  { commands: privateCommands, scope: { type: "all_private_chats" } },
  { commands: groupCommands, scope: { type: "all_group_chats" } }
]);

bot.api.config.use(markdownParser);
