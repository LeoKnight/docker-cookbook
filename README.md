# Docker-cookbook

## 什么是 docker？

Docker 是一个基于Go 语言的应用容器引擎，正如其名字一样，它就像一个码头，可以运行各种应用环境，容器中是沙盒环境，容器之间互不影响，所以非常适合作为微服务的载体

## 虚拟化容器的好处是什么

我们可以简化移交作业流程，免除重建基础工程，可以让开发，测试和 prod 环境无缝衔接

## 开始学习使用 docker

### search & run

首先可以去 [docker hub](https://hub.docker.com/explore/) 上寻找你需要使用的 image
或者使用 shell 来搜索

```shell
docker search ubuntu # 这会列出所有结果
# 然而我们可能仅仅需要最热门的资源
docker search -s 1000 ubuntu # 只显示⭐️超过1000 的镜像
```

run

```shell
docker pull ubuntu
# 或者
docker install ubuntu
# 当然可以直接 run， 如果本地没有，会自动安装
docker run ubuntu
# 交互式启动container
docker run -it ubuntu /bin/bash # 使用bash 进入容器repl环境
# deamon(守护进程)式启动container
docker run -d --name=other_name ubuntu # 后台运行容器
```

run 常用参数

| 命令   | 含义                                               |
| ------ | -------------------------------------------------- |
| -t     | Allocate a pseudo-TTY] (使用终端)                  |
| -i     | Keep STDIN open even if not attached  (交互式操作) |
| -v     | Bind mount a volume                                |
| -d     | Run container in background and print container ID |
| --name | Assign a name to the container                     |

### 制作一个镜像

#### 交互式创建 image

进入容器安装依赖

```shell
docker run -it ubuntu /bin/bash 
# 此时已进入容器环境
cat /etc/issue  # 查看当前 Linux 版本
sed -i "s/archive.ubuntu.com/mirrors.aliyun.com/g" /etc/apt/sources.list    # 设置阿里镜像
apt-get update && apt-get install -y nodejs npm vim  #安装依赖
node -v # 查看安装依赖是否成功
exit    # 退出容器
```

此时容器内依赖已经安装完，但是并没有保存为镜像，我们需要使用 commit 制作镜像，才能上传给其他人使用

```shell
docker ps   # 查看运行中的容器
# 因为我们刚才已经关闭（exit）了容器，所以需要加 -a 参数
docker ps -a 
# 此时会列出所有容器，复制刚才操作过的容器的 container-id
docker commit -a 'leo' -m 'install nodejs' [CONTAINER ID] [IMAGE-NAME:TAG]
```

此时已经完成创建已安装完依赖的镜像了，使用已创建的镜像搭建服务

```shell
mkdir demo && cd demo && yarn add koa && mkdir src
```

```javascript
const Koa = require('koa')
const app = new Koa()

app.use(async ctx => {
  console.log('method====>', ctx.request.method, '\nip=====>', ctx.request.ip)
  ctx.body = 'Hello World'
})

app.listen(3000)
```

写一个简单http 服务保存到src/app.js， 
当前目录结构为

```shell
.
├── Dockerfile
├── README.md
├── package.json
├── src
│   └── app.js
├── .dockerignore
└── .gitignore
```

进入镜像，使用-v 把项目源代码拷贝到镜像中

```shell

docker run -it -v /Users/leo/Desktop/docker:/app -p 9000:3000 ubuntu-node:0.0.1 /bin/bash

# 执行服务
node app/src/app.js
```

此时访问本地的9000端口就能访问服务了

#### 配置 dockerfile 创建 image

首先从写一个 **Dockerfile** 开始，在项目根目录创建Dockerfile 文件

```dockerfile
FROM ubuntu

# 使用阿里源
RUN sed -i "s/archive.ubuntu.com/mirrors.aliyun.com/g" /etc/apt/sources.list

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

```

使用build 创建镜像

```shell
docker build -t node-demo:0.1 .

```

-t 参数使我们可以自定义容器的名字
此时已经创建了安装完依赖的镜像，直接执行run 执行镜像

```shell
docker run -d -p 3000:3000 node-demo:0.1
```

此时访问[localhost](http://localhost:3000)3000端口可以看到服务返回的数据，使用`docker ps` 可以看到容器在运行，因为容器是以deamon（守护进程）的方式执行的，所以我们看不到容器控制台的输出，如果我们需要得到控制台的输出，需要给容器tty 的环境，这时我们可以用 `attach` 命令与运行中的容器进行交互

```shell
docker ps # 拿到执行容器的container id
docker attach [CONTAINER-ID]
```

此时我们再次访问[localhost](http://localhost:3000) 就可以看到控制台的输出了
但是此时我们无论是使用 `control+C` `control+D` 都无法退回到宿主shell环境，这是因为 `attach` 命令并不会分配一个新的tty，而是继续执行容器中执行中的tty，所以无法退出。
当我们想更新容器中的源码的时候，我们可以使用`docker exec`进入到容器

```shell
docker exec -it [CONTAINER-ID] bash
vim src/app.js # 把hello world 改为 innovation
exit
docker restart [CONTAINER-ID] # 重启容器
```

再次访问[localhost](http://localhost:3000) 将会看到变化之后的结果

tips
**save** 和 **load** 可以方便的帮助我们打包和解压容器,便于传输

```shell
docker save leoknight/node-demo:0.2 > app.tar # 把镜像打包
docker load -i app.tar  # 解压并载入
```
### tips

### 当容器跑起来之后如何查看容器占用端口呢？

```shell
docker inspect --format '{{ .NetworkSettings.IPAddress }}' <container-ID>
# 或
docker inspect <container id>
# 或
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container_name_or_id>
```
