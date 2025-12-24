import zod from "zod";

const ENV = zod.object({
  BOT_TOKEN: zod.string(),
  DATABASE_URL: zod.url(),
  REDIS_URL: zod.url(),
  PROBLEM_MINUTES: zod.number().default(5),
  PROBLEM_SLUG: zod.string().default("add-two-integers"),
  NODE_ENV: zod.enum(["development", "production"]).default("production")
});

const env = ENV.safeParse(process.env);

if (!env.success) {
  console.error("Invalid environment variables: ", env.error.issues);
  process.exit(1);
}

export const {
  DATABASE_URL,
  BOT_TOKEN,
  REDIS_URL,
  PROBLEM_SLUG,
  PROBLEM_MINUTES,
  NODE_ENV
} = env.data;
