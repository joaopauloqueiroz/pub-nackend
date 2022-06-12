FROM node:16.4.2-alpine
ENV TZ=America/Sao_Paulo
ENV DOCKER_CONTAINER=1
RUN apk add --no-cache ghostscript=9.53.3-r1 graphicsmagick=1.3.36-r0
RUN chown node:node .
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .
USER node
EXPOSE 3333
CMD ["npm", "run", "start:dev"]
