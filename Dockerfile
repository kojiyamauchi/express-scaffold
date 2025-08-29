FROM node:22.18.0-alpine3.21
WORKDIR /application

RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && echo "Asia/Tokyo" > /etc/timezone

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./apps ./apps
COPY ./client ./client
COPY ./delivery ./delivery

# when client build, error occur below.
# warning Error running install script for optional dependency: "/application/node_modules/gifsicle: Command failed.
# gifsicle pre-build test failed
# Error: Command failed: /bin/sh -c autoreconf -ivf
# Error running install script for optional dependency: "/application/node_modules/optipng-bin: Command failed.
# error /application/node_modules/mozjpeg: Command failed.
# https://github.com/imagemin/optipng-bin/issues/84
RUN apk --update add --no-cache pkgconfig \
    autoconf \
    automake \
    libtool \
    nasm \
    build-base \
    gifsicle \
    gcompat \
    zlib-dev
RUN corepack enable
RUN yarn set version 4.6.0
RUN yarn workspace client add global gulp-cli \
    && yarn
EXPOSE 4000 8000 9999
CMD ["yarn", "dev"]