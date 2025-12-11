import { I18n } from "@grammyjs/i18n";
import { type Context } from "grammy";

export const i18n = <C extends Context>() =>
  new I18n<C>({
    defaultLocale: "en",
    useSession: true,
    directory: "locales"
  });
