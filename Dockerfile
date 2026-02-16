FROM node:22-slim

RUN apt-get update -y && apt-get install -y openssl
RUN npm install -g bun

WORKDIR /app

ADD ./package.json /app/package.json
ADD ./bun.lock /app/bun.lock

RUN bun install --frozen-lockfile

ADD ./ /app/

RUN bun run build

RUN bun run download-content
RUN --mount=type=secret,id=OPENAI_API_KEY \
    OPENAI_API_KEY=$(cat /run/secrets/OPENAI_API_KEY) \
    bun run init-vector-store

EXPOSE 1234

CMD ["bun", "run", "start"]