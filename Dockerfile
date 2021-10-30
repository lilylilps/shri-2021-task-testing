FROM node:12.18.1-alpine

RUN apk update && apk add python make g++

WORKDIR /app

COPY package.json /app/package.json

RUN npm install --quiet

COPY . /app

RUN npm run build

EXPOSE 3000

CMD npm start