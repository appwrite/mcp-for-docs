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
RUN bun run init-vector-store

EXPOSE 1234

CMD ["node", "dist/index.js"]