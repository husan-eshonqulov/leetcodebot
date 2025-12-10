import { Context, lazySession, LazySessionFlavor } from "grammy";

interface PrivateSessionData {
  __language_code?: string;
}

export type PrivateSession = LazySessionFlavor<PrivateSessionData>;

export const privateSession = <C extends Context>() =>
  lazySession<PrivateSessionData, C>({ initial: () => ({}) });
