FROM node:latest

RUN mkdir -p /app
WORKDIR /app

ADD . /app/

RUN npm install --registry=https://registry.npm.taobao.org

EXPOSE 27101

CMD ["npm", "start"]
