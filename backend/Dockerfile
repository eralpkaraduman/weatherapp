FROM node:8
ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 9000
CMD [ "npm", "start" ]
