import winston from "winston";

import { NODE_ENV } from "./constants.js";

const { combine, timestamp, printf, colorize, json } = winston.format;
const isProd = NODE_ENV === "production";

const prodFormat = combine(timestamp(), json());

const devFormat = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf(({ level, message, timestamp, ...meta }) => {
    return `[${timestamp as string}] ${level}:\t${message as string} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
  })
);

export const logger = winston.createLogger({
  level: isProd ? "info" : "debug",
  format: isProd ? prodFormat : devFormat,
  transports: [new winston.transports.Console()]
});
