# 17Disney Wait Times Service

```shell
docker stop 17disney-wait-times-service \
&& docker rm 17disney-wait-times-service \
&& cd /app/wait-times-service \
&& git pull \
&& docker build -t 17disney-wait-times-service . \
&& docker run -d -p 27110:80 --name 17disney-wait-times-service \
--mount type=bind,source=/app/config/wait-times-service,target=/app/config \
17disney-wait-times-service npm run docker
```
