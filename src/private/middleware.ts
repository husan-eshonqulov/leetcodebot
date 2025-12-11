import { type Middleware } from "grammy";

import { prisma } from "../prisma.js";
import { type PrivateContext } from "./index.js";

export const createUser: Middleware<PrivateContext> = async (ctx, next) => {
  const session = await ctx.session;

  if (typeof session.created === "boolean") {
    return next();
  }

  await prisma.user.upsert({
    where: { id: ctx.from.id },
    create: { id: ctx.from.id },
    update: {}
  });

  session.created = true;

  return next();
};

export const authenticateUser: Middleware<PrivateContext> = async (
  ctx,
  next
) => {
  const session = await ctx.session;

  if (typeof session.admin === "boolean") {
    return next();
  }

  const admin = await prisma.admin.findFirst({
    where: { userId: ctx.from.id }
  });

  session.admin = !!admin;

  return next();
};
