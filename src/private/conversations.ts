import { type ConversationBuilder } from "@grammyjs/conversations";

import { PROBLEM_MINUTES, PROBLEM_SLUG } from "../constants.js";
import { Leetcode } from "../leetcode.js";
import { prisma } from "../prisma.js";
import { type PrivateBaseContext, type PrivateContext } from "./index.js";

type ConvoBuilder = ConversationBuilder<PrivateContext, PrivateBaseContext>;

export const registerProfile: ConvoBuilder = async (convo, ctx) => {
  await ctx.reply("Enter leetcode username");

  let username: string;
  let isValid = false;

  while (!isValid) {
    const usernameCheckpoint = convo.checkpoint();

    username = await convo.form.text({
      otherwise: async (ctx) => {
        await ctx.reply("Send text message");
        await convo.rewind(usernameCheckpoint);
      }
    });

    if (username.startsWith("/")) {
      await ctx.reply("The conversation is canceled");
      return;
    }

    const exist = await prisma.profile.findUnique({ where: { username } });
    if (exist) {
      await ctx.reply("Username already exists, try again");
      continue;
    }

    const valid = await Leetcode.isValidUsername(username);
    if (!valid) {
      await ctx.reply("Username is invalid, try again");
      continue;
    }

    isValid = true;
  }

  let shouldExit = false;

  const doneMenu = convo
    .menu("verification-menu")
    .text("Done", async (ctx) => {
      await ctx.reply("Checking your submission...");
      // session.profile = "husan";
      shouldExit = true;
      ctx.menu.close();
      // try {
      //   const submissions = await Leetcode.getAcceptedSubmissions(username);
      //   const solved = Leetcode.solvedWithinLast24(Date.now(), submissions[0]);
      //
      //   if (solved) {
      //     // Create profile
      //     await prisma.profile.create({
      //       data: {
      //         userId: ctx.from.id,
      //         username: username,
      //         verifiedAt: new Date()
      //       }
      //     });
      //
      //     await ctx.reply(
      //       "✅ Verification successful! Your profile has been registered."
      //     );
      //     ctx.menu.close(); // Close the menu
      //   } else {
      //     await ctx.reply(
      //       "❌ No accepted submission found in the last 24 hours. Please solve the problem and try again."
      //     );
      //     ctx.menu.update(); // Keep menu active
      //   }
      // } catch (error) {
      //   await ctx.reply("Error checking submissions. Please try again.");
      //   ctx.menu.update(); // Keep menu active
      // }
    })
    .text("Cancel", (ctx) => {
      shouldExit = true;
      ctx.menu.close();
    });

  await ctx.reply(
    `Solve this problem within ${PROBLEM_MINUTES} minutes:\n\n` +
      `https://leetcode.com/problems/${PROBLEM_SLUG}\n\n` +
      `Click "Done" when you've solved it.`,
    { reply_markup: doneMenu }
  );

  await convo.waitUntil(() => shouldExit, {
    otherwise: async (ctx) => {
      await ctx.reply("Please use the menu buttons above");
    }
  });
};
