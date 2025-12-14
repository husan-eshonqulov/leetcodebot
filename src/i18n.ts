import { I18n } from "@grammyjs/i18n";
import { Menu } from "@grammyjs/menu";
import ISO6391 from "iso-639-1";
import { type LanguageCode } from "iso-639-1";

import { BotContext } from "./bot.js";
import { chunkButtons } from "./keyboard.js";
import { logger } from "./logger.js";

export const i18n = new I18n<BotContext>({
  directory: "locales",
  localeNegotiator: async (ctx) => {
    const { locale } = await ctx.session;
    return locale ?? ctx.from.language_code ?? "en";
  }
});

export const locales = i18n.locales;

export const validateLocales = (locales: string[]) => {
  const codes = ISO6391.getAllCodes();

  locales.forEach((code) => {
    if (!codes.includes(code as LanguageCode)) {
      logger.error(
        `Invalid locale "${code}": expected a two-letter lowercase locale code.`
      );
      process.exit(1);
    }
  });
};

const languageDisplayNameCache = new Map<string, Intl.DisplayNames>();

export const getLanguageDisplayName = (baseLocale: string) => {
  if (!languageDisplayNameCache.has(baseLocale)) {
    languageDisplayNameCache.set(
      baseLocale,
      new Intl.DisplayNames(baseLocale, { type: "language" })
    );
  }
  return (code: string) => languageDisplayNameCache.get(baseLocale)!.of(code);
};

export const languageMenu = new Menu<BotContext>("languageMenu");
const buttons = chunkButtons(locales);

buttons.forEach((row) => {
  row.forEach((code) => {
    languageMenu.text(
      async (ctx) => {
        const locale = await ctx.i18n.getLocale();
        return `${getLanguageDisplayName(locale)(code) ?? code}`;
      },
      async (ctx) => {
        const locale = await ctx.i18n.getLocale();
        const language = getLanguageDisplayName(locale)(code) ?? code;

        const session = await ctx.session;
        session.locale = code;

        logger.info("Language changed", {
          userId: ctx.from.id,
          from: locale,
          to: code
        });

        await ctx.editMessageText(ctx.t("language-set", { language }), {
          reply_markup: undefined
        });
      }
    );
  });

  languageMenu.row();
});
