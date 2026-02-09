# Stage 1/2 - Builder
FROM node:22-alpine AS base

#RUN apk update

# add chromium
RUN apk add --no-cache \
    chromium \
    freetype \
    harfbuzz \
    ttf-freefont

ARG GIT_SHA

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

COPY packages ./packages
COPY apps/pdf-service-api ./apps/pdf-service-api

RUN npm ci --loglevel notice --workspace=pdf-service-api --ignore-scripts

ENV NODE_ENV=production
ENV GIT_SHA=$GIT_SHA

# --------------------------------

# Stage 2/2 - App run
FROM base

ARG GIT_SHA

WORKDIR /usr/src/app/apps/pdf-service-api

ENV NODE_ENV=production
ENV GIT_SHA=$GIT_SHA

EXPOSE 3000

ENTRYPOINT npm run start
