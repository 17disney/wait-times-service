# 17Disney Wait Times Service

```shell
docker stop 17disney-wait-times-service \
&& docker rm 17disney-wait-times-service \
&& cd /data/jenkins/workspace/17disney-wait-times-service \
&& docker build -t 17disney-wait-times-service . \
&& docker run -d -p 27104:80 --name 17disney-wait-times-service \
--mount type=bind,source=/data/config/17disney-wait-times-service,target=/app/config \
17disney-wait-times-service npm run docker
```
