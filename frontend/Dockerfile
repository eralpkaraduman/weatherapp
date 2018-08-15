FROM node:8
EXPOSE 8080
ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV production
RUN npm -g install static-server
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install --only=dev
COPY ./ ./

CMD npm run build && static-server dist -p 8080
