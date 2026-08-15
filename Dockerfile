FROM docker.io/oven/bun:1.3 AS build

WORKDIR /app
COPY . .

RUN bun install --frozen-lockfile

WORKDIR /app/web

RUN bun run build

FROM docker.io/oven/bun:1.3-distroless AS base

EXPOSE 3000

FROM base AS web

COPY --from=build /app/web/build /app
COPY --from=build /app/web/drizzle /app/drizzle

ENV DRIZZLE_MIGRATION_DIR=/app/drizzle

WORKDIR /app

CMD ["run","./index.js"]
