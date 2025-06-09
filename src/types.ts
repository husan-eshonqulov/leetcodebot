import {
  ConversationBuilder,
  ConversationFlavor
} from "@grammyjs/conversations";
import { I18nFlavor } from "@grammyjs/i18n";
import {
  CallbackQueryMiddleware,
  CommandMiddleware,
  Context,
  FilterQuery,
  LazySessionFlavor,
  Middleware
} from "grammy";

import { LeetcodeResponseSuccess } from "./leetcode.js";

export type LeetcodeStats = LeetcodeResponseSuccess["data"];

export type PrivateChatSession = {
  // type: "private";
  __language_code?: string;
  isCreated?: boolean;
  isRegistering?: boolean;
  profile?: string;
};

export type GroupChatSession = {
  // type: "group";
  __language_code?: string;
  members?: number[];
};

type BotBaseContext = Context &
  LazySessionFlavor<PrivateChatSession | GroupChatSession> &
  I18nFlavor;

export type BotContext = ConversationFlavor<BotBaseContext>;

export type BotCommand = {
  name: string;
  description: string;
  handler: CommandMiddleware<BotContext>;
};

export type BotCallback = {
  pattern: string | RegExp;
  handler: CallbackQueryMiddleware<BotContext>;
};

export type BotConversation = {
  name: string;
  builder: ConversationBuilder<BotContext, BotBaseContext>;
};

export type BotEvent = {
  type: FilterQuery;
  handler: Middleware<BotContext>;
};
