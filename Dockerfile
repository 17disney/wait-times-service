# 指定我们的基础镜像是node，版本是v8.0.0
FROM node:8.1.2

# 将根目录下的文件都copy到container（运行此镜像的容器）文件系统的app文件夹下
# ADD . /app/
# cd到app文件夹下
# WORKDIR /app

# 安装项目依赖包
RUN npm i

# 容器对外暴露的端口号
EXPOSE 8000

# 容器启动时执行的命令，类似npm run start
CMD ["npm", "start"]
