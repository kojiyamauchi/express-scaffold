FROM node:18.18.1-alpine3.18
WORKDIR /application

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
    zlib-dev
RUN yarn
EXPOSE 3000 8000 9999
CMD ["yarn", "dev"]