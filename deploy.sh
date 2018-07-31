cd /app/wait-times-service
git pull
docker build -t 17disney-wait-times-service .

docker stop 17disney-wait-times-service
docker rm 17disney-wait-times-service

docker run -d \
  --name 17disney-wait-times-service \
  -p 27110:80 \
  --mount type=bind,source=/app/config/wait-times-service,target=/app/config \
  --restart always \
  17disney-wait-times-service \
  npm run docker
