import zod from "zod";

const ENV = zod.object({
  DATABASE_URL: zod.url(),
  BOT_TOKEN: zod.string()
});

const env = ENV.safeParse(process.env);

if (!env.success) {
  console.error("Invalid environment variables: ", env.error.issues);
  process.exit(1);
}

export const { DATABASE_URL, BOT_TOKEN } = env.data;
