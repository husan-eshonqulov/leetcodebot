import zod from "zod";

const ENV = zod.object({
  BOT_TOKEN: zod.string(),
  DATABASE_URL: zod.url(),
  REDIS_URL: zod.url(),
  NODE_ENV: zod.string().default("development")
});

const env = ENV.safeParse(process.env);

if (!env.success) {
  console.error("Invalid environment variables: ", env.error.issues);
  process.exit(1);
}

export const { DATABASE_URL, BOT_TOKEN, REDIS_URL, NODE_ENV } = env.data;
