FROM node:8
ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV production
EXPOSE 8000
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY ./ ./

CMD npm start
