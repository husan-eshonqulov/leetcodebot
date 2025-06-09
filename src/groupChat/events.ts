import { prisma } from "../db.js";
import { BotEvent } from "../types.js";

const myChatMember: BotEvent["handler"] = async (ctx) => {
  const { old_chat_member, new_chat_member, chat } = ctx.update.my_chat_member!;

  const isJoining =
    ["left", "kicked"].includes(old_chat_member.status) &&
    ["member", "administrator"].includes(new_chat_member.status);

  const isLeaving =
    ["member", "administrator"].includes(old_chat_member.status) &&
    ["left", "kicked"].includes(new_chat_member.status);

  if (isJoining) {
    await prisma.group.create({
      data: { id: chat.id, title: chat.title, type: chat.type }
    });
    return;
  }

  if (isLeaving) {
    await prisma.group.delete({ where: { id: chat.id } });
  }
};

export const events: BotEvent[] = [
  {
    type: "my_chat_member",
    handler: myChatMember
  }
];
