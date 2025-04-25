FROM node:18-slim

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install
RUN yarn add browserslist@latest
RUN yarn add update-browserslist-db@latest
RUN yarn global add serve

COPY . .

RUN yarn build
  
EXPOSE 3000

CMD [ "serve", "-s", "build" ]
