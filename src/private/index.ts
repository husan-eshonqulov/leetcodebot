import { I18nFlavor } from "@grammyjs/i18n";
import { Composer, Context } from "grammy";

import { type PrivateSession, privateSession } from "./session.js";

export type PrivateContext = Context & PrivateSession & I18nFlavor;

export const privateChat = new Composer<PrivateContext>();

privateChat.use(privateSession());
