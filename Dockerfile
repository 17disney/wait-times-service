FROM node:latest

COPY . /app/
WORKDIR /app

RUN npm install --registry=https://registry.npm.taobao.org

EXPOSE 80

CMD ["npm", "run", "docker"]
