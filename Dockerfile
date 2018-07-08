FROM ubuntu

MAINTAINER leoknight

RUN apt-get update && apt-get install -y nodejs npm

WORKDIR /app

# 安装npm模块
ADD package.json /app/package.json

# 使用淘宝的npm镜像
RUN npm install --production -d --registry=https://registry.npm.taobao.org

# 添加源代码
ADD . /app

# 运行app.js
CMD ["node", "/app/src/app.js"]
