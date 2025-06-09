FROM node:22-alpine AS base
WORKDIR /app
COPY package.json package-lock.json .
RUN npm ci --only=prod

FROM base AS build
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

FROM node:22-alpine
WORKDIR /app
COPY . .
COPY --from=base /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["npm", "start"]
