import { createConversation } from "@grammyjs/conversations";
import { Composer, Transformer } from "grammy";
import { BotCommandScope } from "grammy/types";
import { RedisClientType } from "redis";

import { bot } from "./bot.js";
import { PARSE_MODE } from "./constants.js";
import { BotCallback, BotCommand, BotConversation, BotEvent } from "./types.js";
import { BotContext } from "./types.js";

const registerItems = <T>(items: T[], registerItem: (item: T) => void) => {
  items.forEach((item) => registerItem(item));
};

export const registerCommands = (
  commands: BotCommand[],
  composer: Composer<BotContext>
) => {
  registerItems(commands, ({ name, handler }) => {
    composer.command(name, handler);
  });
};

export const registerCallbackQueries = (
  queries: BotCallback[],
  composer: Composer<BotContext>
) => {
  registerItems(queries, ({ pattern, handler }) => {
    composer.callbackQuery(pattern, handler);
  });
};

export const registerConversations = (
  conversations: BotConversation[],
  composer: Composer<BotContext>
) => {
  registerItems(conversations, ({ builder, name }) => {
    composer.use(createConversation(builder, name));
  });
};

export const registerEvents = (
  events: BotEvent[],
  composer: Composer<BotContext>
) => {
  registerItems(events, ({ type, handler }) => {
    composer.on(type, handler);
  });
};

const toApiCommand = ({ name, description }: BotCommand) => ({
  command: name,
  description
});

export const setBotCommands = async (
  botCommands: { commands: BotCommand[]; scope: BotCommandScope }[]
) => {
  await Promise.all(
    botCommands.map(({ commands, scope }) =>
      bot.api.setMyCommands(commands.map(toApiCommand), { scope })
    )
  );
};

export const markdownParser: Transformer = (prev, method, payload, signal) => {
  const methods = ["sendMessage", "editMessageText"];

  if (methods.includes(method) && payload && !("parse_mode" in payload)) {
    payload = { ...payload, parse_mode: PARSE_MODE };
  }

  return prev(method, payload, signal);
};

export const escapeMarkdown = (text: string) => {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
};

export const getRedisValue = async <T>(
  redis: RedisClientType,
  key: number,
  field: string
) => {
  const result = await redis.json.get(String(key), { path: `$.${field}` });

  if (!result) return undefined;

  return (JSON.parse(result as string) as T[])[0];
};
