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

# Copy raw content
COPY ./content /app/content
# Copy vector store .db file
COPY ./tmp/vector-store.db /app/tmp/vector-store.db

EXPOSE 1234

CMD ["node", "dist/index.js"]