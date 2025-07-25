FROM node:18-slim AS base
ARG SERVER_TYPE

WORKDIR /usr/src/app

COPY package*.json ./

ENV TZ=Europe/Madrid
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update \
 && apt-get install wget unzip zip -y

RUN npm install -g npm@9.8.1
RUN npm install -g typescript
RUN npm install -g del-cli
RUN npm install

COPY ./tsconfig.json .
COPY ./source ./source

# Must be modified in GIT
COPY ./.docker.env ./.docker.env
COPY ./.docker.socket.env ./.docker.socket.env
COPY ./.docker.socket.protocol1903.env ./.docker.socket.protocol1903.env
COPY ./.docker.socket.protocol808.env ./.docker.socket.protocol808.env
COPY ./.docker.socket.protocoltopin.env ./.docker.socket.protocoltopin.env
COPY ./.docker.http.env ./.docker.http.env

RUN if [ "$SERVER_TYPE" = "socket" ]; then \
      cp ./.docker.socket.env ./.env ; \
    elif [ "$SERVER_TYPE" = "socket-1903" ]; then \
      cp ./.docker.socket.protocol1903.env ./.env ; \
    elif [ "$SERVER_TYPE" = "socket-808" ]; then \
      cp ./.docker.socket.protocol808.env ./.env ; \
    elif [ "$SERVER_TYPE" = "socket-topin" ]; then \
      cp ./.docker.socket.protocoltopin.env ./.env ; \
    elif [ "$SERVER_TYPE" = "http" ]; then \
      cp ./.docker.http.env ./.env ; \
    else \
      cp ./.docker.env ./.env ; \
    fi

RUN del-cli --force ./build && tsc

EXPOSE 9010 
EXPOSE 9011

CMD [ "node", "./build/server.js" ]