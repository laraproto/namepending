FROM docker.io/oven/bun:1.3 AS build

WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile

WORKDIR /app/api

RUN bun run build

WORKDIR /app/web

RUN bun run build

FROM docker.io/oven/bun:1.3-distroless AS base

EXPOSE 3000

FROM base as api

COPY --from=build /app/api/dist /app

WORKDIR /app

CMD ["run","./index.js"]

FROM docker.io/oven/bun:1.3-alpine as migrate

WORKDIR /app

COPY --from=build /app /app
WORKDIR /app/api

CMD ["run","db:migrate"]

FROM base as web

COPY --from=build /app/web/build /app

WORKDIR /app

CMD ["run","./index.js"]
