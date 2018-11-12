ARG NODE_VERSION=11
FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV production

RUN apk --no-cache add \
    g++ \
    git \
    make \
    python

COPY . /app

WORKDIR /app

RUN npm install --unsafe-perm --production=false && \
    npm run build && \
    npm run test && \
    npm prune
