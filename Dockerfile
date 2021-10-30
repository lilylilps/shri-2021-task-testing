FROM node:14-alpine

RUN apk update && apk add python make g++

WORKDIR /app

COPY package.json /app/package.json

RUN npm install --silent

COPY . /app

RUN npm run build

EXPOSE 3000

CMD npm start