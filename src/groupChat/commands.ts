import { prisma, redis } from "../db.js";
import { getRedisValue } from "../helpers.js";
import { BotCommand, GroupChatSession } from "../types.js";

const join: BotCommand["handler"] = async (ctx) => {
  const userId = ctx.update.message!.from.id;
  const groupId = ctx.update.message!.chat.id;
  const messageId = ctx.update.message!.message_id;
  const session = (await ctx.session) as GroupChatSession;
  const profile = await getRedisValue<string>(redis, userId, "profile");

  if (!profile) {
    await ctx.reply(ctx.t("join_not_register"), {
      reply_parameters: { message_id: messageId }
    });
    return;
  }

  if (!session.members!.includes(userId)) {
    await prisma.member.create({
      data: { user_id: userId, group_id: groupId }
    });
    session.members!.push(userId);
    await ctx.reply(ctx.t("join_success"), {
      reply_parameters: { message_id: messageId }
    });
    return;
  }

  await ctx.reply(ctx.t("join_already"), {
    reply_parameters: { message_id: messageId }
  });
};

const leave: BotCommand["handler"] = async (ctx) => {
  const userId = ctx.update.message!.from.id;
  const groupId = ctx.update.message!.chat.id;
  const messageId = ctx.update.message!.message_id;
  const session = (await ctx.session) as GroupChatSession;

  if (!session.members!.includes(userId)) {
    await ctx.reply(ctx.t("join_not_found"), {
      reply_parameters: { message_id: messageId }
    });
    return;
  }

  await prisma.member.delete({
    where: { user_id_group_id: { user_id: userId, group_id: groupId } }
  });

  const filteredMembers = session.members!.filter((id) => id !== userId);
  session.members = filteredMembers;

  await ctx.reply(ctx.t("leave_success"), {
    reply_parameters: { message_id: messageId }
  });
};

export const commands: BotCommand[] = [
  {
    name: "join",
    description: "join command",
    handler: join
  },
  {
    name: "leave",
    description: "leave command",
    handler: leave
  }
];
