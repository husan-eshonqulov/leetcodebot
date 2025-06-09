import { Profile, User } from "@prisma/client";
import pLimit from "p-limit";

import { bot } from "../bot.js";
import { prisma, redis } from "../db.js";
import { escapeMarkdown } from "../helpers.js";
import { i18n } from "../i18n.js";
import { fetchLeetcodeStats } from "../leetcode.js";
import { LeetcodeStats } from "../types.js";

type GroupWithMembers = {
  id: bigint;
  members: { user: User & { profile: Profile | null } }[];
};

type UserWithYestSubs = User & {
  yestSubmissions: LeetcodeStats["recentSubmissionList"];
};

const getGroupLocale = async (groupId: bigint) => {
  const locales = (await redis.json.get(String(groupId), {
    path: "$.__language_code"
  })) as string;

  return (JSON.parse(locales) as string[])[0];
};

const getYesterdaySubmissions = (
  recentSubmissionList: LeetcodeStats["recentSubmissionList"]
) => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  return recentSubmissionList.filter((submission) => {
    const submittedTimestamp = Number(submission.timestamp);
    const oneDay = 24 * 3600;
    return (
      currentTimestamp - submittedTimestamp < oneDay &&
      submission.statusDisplay === "Accepted"
    );
  });
};

const mentionUser = ({
  id,
  first_name,
  username
}: Pick<User, "id" | "first_name" | "username">) => {
  const tag = username ? "@" + username : first_name;
  return `[${escapeMarkdown(tag)}](tg://user?id=${id})`;
};

export const notifyInactiveUsers = async (groupId: bigint, users: User[]) => {
  const mentions = users.map(mentionUser).join(", ");
  const locale = await getGroupLocale(groupId);

  const message = i18n.t(locale, "tag_inactive_users", { users: mentions });

  await bot.api.sendMessage(String(groupId), message);
};

export const notifyActiveUsers = async (
  groupId: bigint,
  users: UserWithYestSubs[]
) => {
  const locale = await getGroupLocale(groupId);

  const usersWithSubs = users
    .map(({ id, first_name, username, yestSubmissions }) => {
      const mention = mentionUser({ id, first_name, username });
      const extra = yestSubmissions.length >= 20 ? "..." : "";

      const problemLinksList = yestSubmissions
        .map((submission, index) => {
          const { title, titleSlug } = submission;
          return (
            escapeMarkdown(`${++index}. `) +
            `[${escapeMarkdown(title)}](https://leetcode.com/problems/${titleSlug})`
          );
        })
        .join("\n");

      return `${mention}\n` + problemLinksList + extra;
    })
    .join("\n\n");

  const message = i18n.t(locale, "tag_active_users", { usersWithSubs });

  await bot.api.sendMessage(String(groupId), message);
};

export const getGroupsWithUsers = async () => {
  return await prisma.group.findMany({
    select: {
      id: true,
      members: {
        select: {
          user: {
            include: {
              profile: true
            }
          }
        }
      }
    }
  });
};

const getUserWithYestSubs = async (
  user: GroupWithMembers["members"][0]["user"]
) => {
  const { recentSubmissionList } = (await fetchLeetcodeStats(
    user.profile!.username
  ))!;

  const yestSubmissions = getYesterdaySubmissions(recentSubmissionList);

  return { ...user, yestSubmissions };
};

const getMembersWithYestSubs = (members: GroupWithMembers["members"]) => {
  const limit = pLimit(5);
  return Promise.all(
    members.map(({ user }) => limit(() => getUserWithYestSubs(user)))
  );
};

export const getGroupsWithYestSubs = (groups: GroupWithMembers[]) => {
  return Promise.all(
    groups.map(async ({ id, members }) => {
      const membersWithSubs = await getMembersWithYestSubs(members);

      return { id, members: membersWithSubs };
    })
  );
};
