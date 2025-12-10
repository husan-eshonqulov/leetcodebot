import { I18nFlavor } from "@grammyjs/i18n";
import { Composer, Context, Middleware } from "grammy";

import { prisma } from "../prisma.js";
import { type PrivateSession, privateSession } from "./session.js";

export type PrivateContext = Context & PrivateSession & I18nFlavor;

export const privateChat = new Composer<PrivateContext>();

const authUser: Middleware<PrivateContext> = async (ctx, next) => {
  const session = await ctx.session;

  if (typeof session.isAdmin === "boolean") await next();

  const user = await prisma.admin.findFirst({
    where: { userId: ctx.from?.id }
  });

  session.isAdmin = user ? true : false;

  await next();
};

privateChat.use(privateSession());
privateChat.use(authUser);
