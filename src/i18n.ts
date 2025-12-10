import { I18n, I18nFlavor } from "@grammyjs/i18n";
import { Context } from "grammy";

export const i18n = <C extends Context & I18nFlavor>() =>
  new I18n<C>({
    defaultLocale: "en",
    useSession: true,
    directory: "locales"
  });
