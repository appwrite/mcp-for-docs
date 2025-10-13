FROM node:22-slim

RUN apt-get update -y && apt-get install -y openssl
RUN npm install -g bun

WORKDIR /app

ADD ./package.json /app/package.json
ADD ./bun.lock /app/bun.lock

RUN bun install --frozen-lockfile

ADD ./ /app/

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY

RUN bun run build

RUN bun run download-content
RUN OPENAI_API_KEY=$OPENAI_API_KEY bun run init-vector-store

EXPOSE 1234

CMD ["bun", "run", "start"]