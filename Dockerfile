FROM node:8.9.4

COPY . /app/
WORKDIR /app

RUN npm config set registry https://registry.npm.taobao.org
RUN npm install

EXPOSE 80
CMD ["npm", "run", "prod"]
