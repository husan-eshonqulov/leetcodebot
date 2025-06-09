import { CronJob } from "cron";

import { bot } from "../bot.js";
import { prisma, redis } from "../db.js";
import { i18n } from "../i18n.js";
import { fetchLeetcodeStats } from "../leetcode.js";
import { LeetcodeStats } from "../types.js";

type RegisterInfo = {
  username: string;
  userId: number;
  locale: string;
  requiredMinutes: number;
  problemSlug: string;
};

const hasValidSubmission = (
  problemSlug: string,
  requiredMinutes: number,
  recentSubmissions: LeetcodeStats["recentSubmissionList"]
): boolean => {
  const cutoff = Date.now() - requiredMinutes * 60_000;
  return recentSubmissions.some(
    (submission) =>
      submission.titleSlug === problemSlug &&
      Number(submission.timestamp) * 1000 > cutoff
  );
};

const registerProfile = async ({
  username,
  userId,
  locale,
  requiredMinutes,
  problemSlug
}: RegisterInfo) => {
  const { recentSubmissionList } = (await fetchLeetcodeStats(username))!;

  const success = hasValidSubmission(
    problemSlug,
    requiredMinutes,
    recentSubmissionList
  );

  if (success) {
    await prisma.profile.create({
      data: { username, user_id: userId }
    });
    await redis.json.set(String(userId), "$.profile", username);
    await bot.api.sendMessage(userId, i18n.t(locale, "reg_success"));
  } else {
    await bot.api.sendMessage(
      userId,
      i18n.t(locale, "reg_fail", { requiredMinutes })
    );
  }
};

export const createRegisterProfileJob = (info: RegisterInfo) => {
  return new CronJob(
    new Date(Date.now() + info.requiredMinutes * 60_000),
    async () => {
      await registerProfile(info);
      await redis.json.set(String(info.userId), "$.isRegistering", false);
    }
  );
};
