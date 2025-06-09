import { Composer, lazySession } from "grammy";

import { redis, RedisJSONAdapter } from "../db.js";
import { registerCommands, registerEvents } from "../helpers.js";
import { i18n } from "../i18n.js";
import { BotContext, GroupChatSession } from "../types.js";
import { commands } from "./commands.js";
import { events } from "./events.js";

export const groupChatComposer = new Composer<BotContext>();

groupChatComposer.use(
  lazySession<GroupChatSession, BotContext>({
    initial: () => ({ __language_code: "en", members: [] }),
    storage: new RedisJSONAdapter(redis)
  })
);
groupChatComposer.use(i18n);

registerCommands(commands, groupChatComposer);
registerEvents(events, groupChatComposer);
