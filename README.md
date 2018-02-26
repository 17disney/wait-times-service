# Disney-Api

Disney Api服务


```shell
docker stop disney-api \
&& docker rm disney-api \
&& cd /data/jenkins/workspace/disney-api \
&& docker build -t disney-api . \
&& docker run -d -p 27101:80 --name disney-api \
--mount type=bind,source=/data/config/disney-api,target=/app/config \
disney-api npm run docker
```
