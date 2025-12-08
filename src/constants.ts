import zod from "zod";

const ENV = zod.object({
  DATABASE_URL: zod.url(),
  BOT_TOKEN: zod.string(),
  NODE_ENV: zod.string().default("development")
});

const env = ENV.safeParse(process.env);

if (!env.success) {
  console.error("Invalid environment variables: ", env.error.issues);
  process.exit(1);
}

export const { DATABASE_URL, BOT_TOKEN, NODE_ENV } = env.data;
