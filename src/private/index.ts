import { type I18nFlavor } from "@grammyjs/i18n";
import { type ChatTypeContext, Composer, type Context } from "grammy";

import { i18n, languageMenu } from "../i18n.js";
import { languageCmd } from "./commands.js";
import { ensureUserExists } from "./middleware.js";
import { type PrivateSession, privateSession } from "./session.js";

export type PrivateContext = ChatTypeContext<
  Context & PrivateSession & I18nFlavor,
  "private"
>;

export const privateChat = new Composer<PrivateContext>();

privateChat.use(privateSession);
privateChat.use(i18n);
privateChat.use(ensureUserExists);
privateChat.use(languageMenu);

privateChat.command(languageCmd.command, languageCmd.handler);
