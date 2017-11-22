FROM node:latest
RUN npm install -g nodemon
ENTRYPOINT  nodemon