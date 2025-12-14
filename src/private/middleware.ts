import { type Middleware } from "grammy";

import { prisma } from "../prisma.js";
import { type PrivateContext } from "./index.js";

export const ensureUserExists: Middleware<PrivateContext> = async (
  ctx,
  next
) => {
  const session = await ctx.session;

  if (session.initialized) {
    return next();
  }

  await prisma.user.upsert({
    create: { id: ctx.from.id },
    where: { id: ctx.from.id },
    update: {}
  });

  session.initialized = true;

  return next();
};
