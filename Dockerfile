FROM node:8.9.4

COPY . /app/
WORKDIR /app

RUN yarn install

EXPOSE 80
CMD ["npm", "run", "docker"]
