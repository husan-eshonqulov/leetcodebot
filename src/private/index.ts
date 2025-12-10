import { Composer, Context } from "grammy";

import { type PrivateSession, privateSession } from "./session.js";

export type PrivateContext = Context & PrivateSession;

export const privateChat = new Composer<PrivateContext>();

privateChat.use(privateSession());
