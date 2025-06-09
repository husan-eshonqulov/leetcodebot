import { conversations as gConversations } from "@grammyjs/conversations";
import { Composer, lazySession, Middleware } from "grammy";

import { RedisJSONAdapter } from "../db.js";
import { redis } from "../db.js";
import {
  markdownParser,
  registerCallbackQueries,
  registerCommands,
  registerConversations
} from "../helpers.js";
import { i18n } from "../i18n.js";
import { BotContext, PrivateChatSession } from "../types.js";
import { commands } from "./commands.js";
import { conversations } from "./conversations.js";
import { callbackQueries } from "./queries.js";

const parser: Middleware<BotContext> = async (ctx, next) => {
  ctx.api.config.use(markdownParser);
  await next();
};

export const privateChatComposer = new Composer<BotContext>();

privateChatComposer.use(
  lazySession<PrivateChatSession, BotContext>({
    initial: () => ({
      isCreated: false,
      isRegistering: false
    }),
    storage: new RedisJSONAdapter(redis)
  })
);
privateChatComposer.use(i18n);
privateChatComposer.use(gConversations({ plugins: [i18n, parser] }));

registerConversations(conversations, privateChatComposer);
registerCommands(commands, privateChatComposer);
registerCallbackQueries(callbackQueries, privateChatComposer);
