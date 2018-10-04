FROM node:8.11-alpine

RUN mkdir -p /usr/app
ADD . /usr/app
WORKDIR /usr/app

RUN apk add -t .gyp --no-cache git python g++ make \
    && npm install -g truffle \
    && npm install \
    && apk del .gyp


EXPOSE 3030
ENTRYPOINT []
