FROM docker.io/oven/bun:1.3-alpine AS build

WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile

FROM docker.io/oven/bun:1.3-alpine AS base

EXPOSE 3000

FROM base as api

COPY --from=build /app /app

WORKDIR /app/api

CMD ["run","dev"]

FROM base as migrate

COPY --from=build /app /app

WORKDIR /app/api

CMD ["run","db:migrate"]

FROM base as web

COPY --from=build /app /app

WORKDIR /app/web

CMD ["run","dev"]
