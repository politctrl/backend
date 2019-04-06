FROM node:11.13.0-alpine

LABEL maintainer="rnickson <m@mickson.me>"

WORKDIR /app

COPY package.json .
COPY yarn.lock .

# Installing dependencies (node_modules)
RUN yarn

COPY src/ ./src
COPY tsconfig.json .

RUN yarn build

CMD [ "node", "dist/index.js" ]
