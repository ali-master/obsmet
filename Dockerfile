FROM node:8

RUN npm i npm@latest -g

# Create app directory
RUN mkdir -p /usr/OBSMET/ftp-connector
WORKDIR /usr/OBSMET/ftp-connector

COPY ./ftp-connector/package*.json ./
COPY ./ftp-connector/yarn.lock ./

# Bundle app source
COPY ./ftp-connector .

RUN npm install

CMD [ "npm", "watch:nodemon" ]
