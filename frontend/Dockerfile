FROM node:8
ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV development
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 8000
CMD [ "npm", "start" ]
