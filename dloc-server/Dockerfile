# syntax=docker/dockerfile:1.7
FROM node:20-bookworm-slim AS base
ARG SERVER_TYPE

# Establecer zona horaria
ENV TZ=Europe/Madrid
RUN apt-get update \
 && apt-get install -y wget unzip zip tzdata \
 && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# Establecer directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Usar caché para acelerar npm ci
RUN --mount=type=cache,target=/root/.npm \
    npm install -g npm@11.5.2 typescript del-cli && \
    npm install

# Copiar el resto del proyecto
COPY ./tsconfig.json .
COPY ./source ./source

# Copiar archivos de entorno
COPY ./.docker.env ./.docker.env
COPY ./.docker.socket.env ./.docker.socket.env
COPY ./.docker.socket.protocolproto1903.env ./.docker.socket.protocolproto1903.env
COPY ./.docker.socket.protocoljt808.env ./.docker.socket.protocoljt808.env
COPY ./.docker.socket.protocoltopin.env ./.docker.socket.protocoltopin.env
COPY ./.docker.http.env ./.docker.http.env

# Configurar .env dinámicamente
RUN --mount=type=cache,target=/root/.npm \
    if [ "$SERVER_TYPE" = "socket" ]; then \
      cp ./.docker.socket.env ./.env ; \
    elif [ "$SERVER_TYPE" = "socket-proto1903" ]; then \
      cp ./.docker.socket.protocolproto1903.env ./.env ; \
    elif [ "$SERVER_TYPE" = "socket-jt808" ]; then \
      cp ./.docker.socket.protocoljt808.env ./.env ; \
    elif [ "$SERVER_TYPE" = "socket-topin" ]; then \
      cp ./.docker.socket.protocoltopin.env ./.env ; \
    elif [ "$SERVER_TYPE" = "http" ]; then \
      cp ./.docker.http.env ./.env ; \
    else \
      cp ./.docker.env ./.env ; \
    fi

# Compilar TypeScript
RUN npm run build

# Exponer puertos
EXPOSE 9010 
EXPOSE 9011

# Comando final
CMD [ "node", "./build/server.js" ]
