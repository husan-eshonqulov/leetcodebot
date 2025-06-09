import { BotCallback, PrivateChatSession } from "../types.js";

const handleLanguageSelection: BotCallback["handler"] = async (ctx) => {
  const lang = ctx.callbackQuery.data.slice(-2);
  ((await ctx.session) as PrivateChatSession).__language_code = lang;
  await ctx.editMessageText(ctx.t("lang_changed", { lang }));
};

export const callbackQueries: BotCallback[] = [
  {
    pattern: /^set-lan-(uz|en|ru)$/,
    handler: handleLanguageSelection
  }
];
