import { CronJob } from "cron";

import {
  getGroupsWithUsers,
  getGroupsWithYestSubs,
  notifyActiveUsers,
  notifyInactiveUsers
} from "./services.js";

const sendDailyGroupMessages = async () => {
  const groupsWithUsers = await getGroupsWithUsers();
  const groupsWithYestSubs = await getGroupsWithYestSubs(groupsWithUsers);

  await Promise.all(
    groupsWithYestSubs.map(async ({ id, members }) => {
      const activeUsers = members.filter(
        ({ yestSubmissions }) => yestSubmissions.length > 0
      );

      const inactiveUsers = members.filter(
        ({ yestSubmissions }) => yestSubmissions.length === 0
      );

      if (activeUsers.length > 0) {
        await notifyActiveUsers(id, activeUsers);
      }

      if (inactiveUsers.length > 0) {
        await notifyInactiveUsers(id, inactiveUsers);
      }
    })
  );
};

export const sendDailyGroupMessagesJob = new CronJob(
  "1 0 0 * * *",
  sendDailyGroupMessages
);
