import { bot } from "./bot.js";
import { sendDailyGroupMessagesJob } from "./groupChat/jobs.js";

await bot.start({
  onStart: (botInfo) => {
    sendDailyGroupMessagesJob.start();
    console.log(`https://t.me/${botInfo.username} bot has been started...`);
  }
});
