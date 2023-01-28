FROM node:16-alpine

WORKDIR /usr/app/

COPY package.json ./

COPY yarn.lock ./

ENV CHROME_BIN="/usr/bin/chromium-browser" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    udev \
    ttf-freefont \
    chromium 

RUN yarn install 

COPY . .

CMD [ "yarn", "start", "run" ]
