FROM node:8
ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV production
ENV PORT 8080
EXPOSE 8080
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY ./ ./

CMD npm start
