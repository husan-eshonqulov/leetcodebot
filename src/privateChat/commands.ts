import { InlineKeyboard } from "grammy";

import { prisma } from "../db.js";
import { BotCommand, PrivateChatSession } from "../types.js";

const start: BotCommand["handler"] = async (ctx) => {
  const { id, first_name, last_name, username } = ctx.message!.from;
  const session = (await ctx.session) as PrivateChatSession;

  if (!session.isCreated) {
    await prisma.user.create({
      data: { id, first_name, last_name, username }
    });
    session.isCreated = true;
  }

  await ctx.reply(ctx.t("start"));
};

const language: BotCommand["handler"] = async (ctx) => {
  const langsKeyboard = new InlineKeyboard();
  langsKeyboard.text(ctx.t("lang_uz"), "set-lan-uz");
  langsKeyboard.text(ctx.t("lang_en"), "set-lan-en");
  langsKeyboard.text(ctx.t("lang_ru"), "set-lan-ru");

  await ctx.reply(ctx.t("lang_prompt"), {
    reply_markup: langsKeyboard
  });
};

const register: BotCommand["handler"] = async (ctx) => {
  const { profile, isRegistering } = (await ctx.session) as PrivateChatSession;

  if (profile) {
    await ctx.reply(ctx.t("reg_already"));
    return;
  }

  if (isRegistering) {
    await ctx.reply(ctx.t("reg_ongoing"));
    return;
  }

  await ctx.conversation.enter("register-profile");
};

// const unregister: BotCommand["handler"] = async (ctx) => {
//   const session = (await ctx.session) as PrivateChatSession;
//   const message = ctx.update.message!;

//   if (session.profile) {
//     await prisma.profile.delete({ where: { username: session.profile } });
//     await prisma.member.deleteMany({ where: { user_id: message.from.id } });
//     await ctx.reply(ctx.t("unreg_success", { username: session.profile }));
//     session.profile = undefined;
//     return;
//   }

//   await ctx.reply(ctx.t("unreg_not_found"));
// };

export const commands: BotCommand[] = [
  {
    name: "start",
    description: "start command",
    handler: start
  },
  {
    name: "language",
    description: "language command",
    handler: language
  },
  {
    name: "register",
    description: "register command",
    handler: register
  }
];
