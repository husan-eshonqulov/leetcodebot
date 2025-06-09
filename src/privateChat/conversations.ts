import { TranslationVariables } from "@grammyjs/i18n";

import { prisma } from "../db.js";
import { escapeMarkdown } from "../helpers.js";
import { fetchLeetcodeStats } from "../leetcode.js";
import { BotConversation, PrivateChatSession } from "../types.js";
import { createRegisterProfileJob } from "./jobs.js";

const REQUIRED_MINUTES = 3;
const REQUIRED_PROBLEM_SLUG = "add-two-integers";

const t = async (
  cnv: Parameters<BotConversation["builder"]>[0],
  key: string,
  vars?: TranslationVariables<string>
) => {
  return await cnv.external((ctx) => ctx.t(key, vars));
};

const register: BotConversation["builder"] = async (cnv, ctx) => {
  const locale = await cnv.external((ctx) => ctx.i18n.getLocale());
  const { id: userId } = ctx.message!.chat;

  await ctx.reply(await t(cnv, "reg_enter"));

  const usernameCtx = await cnv.waitFor("message:text");
  const username = usernameCtx.message.text.toLowerCase();
  const profile = await cnv.external(async () =>
    prisma.profile.findUnique({ where: { username } })
  );

  if (profile) {
    await ctx.reply(await t(cnv, "reg_exists", { username }));
    return;
  }

  const profileStats = await cnv.external(() => fetchLeetcodeStats(username));

  if (!profileStats) {
    await ctx.reply(await t(cnv, "reg_not_found", { username }));
    return;
  }

  const challengeLink = `https://leetcode.com/problems/${REQUIRED_PROBLEM_SLUG}`;
  const challengeMessage = await t(cnv, "reg_challenge", {
    requiredMinutes: REQUIRED_MINUTES,
    challengeLink: escapeMarkdown(challengeLink)
  });

  await ctx.reply(challengeMessage);

  const registerJob = createRegisterProfileJob({
    username,
    userId,
    locale,
    requiredMinutes: REQUIRED_MINUTES,
    problemSlug: REQUIRED_PROBLEM_SLUG
  });

  registerJob.start();

  await cnv.external(
    (ctx) => ((ctx.session as PrivateChatSession).isRegistering = true)
  );
};

export const conversations: BotConversation[] = [
  {
    name: "register-profile",
    builder: register
  }
];
