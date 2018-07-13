# 分布式服务

在上一节我们掌握使用最基本的镜像制作方法和容器的使用，但是在生产环境中起单个 web 服务/容器往往是不够的，这时候我我们就需要使用`docker compose`
使用 docker compose 之前我们需要把之前可以跑起来的镜像打上 tag,如需要可以 publish 到 docker hub 上

```shell
docker -a leoknight -m 'befor publish' [CONTAINER-ID] node-demo:0.2
docker tag node-demo:0.2 leoknight/node-demo:0.2    # 替换你的id和image name
docker publish leoknight/node-demo:0.2
```

然后在项目中创建`docker-compose.yml`文件

```yml
version: "3"
services:
  web:
    image: leoknight/node-demo:0.2
    deploy:
      replicas: 5
      resources:
        limits:
          cpus: "0.3"
          memory: 500M
      restart_policy:
        condition: on-failure
    ports:
      - "5555:3000"
    networks:
      - webnet
networks:
  webnet:
```

保存之后，在 shell 中，部署分布式应用

```shell
docker stack deploy -c docker-compose.yml getStart
# docker-compose.yml 是配置文件，可以自定义名字，但是必须使用yml格式
# getStart 是为服务起的名字
```

如我们配置文件，我门同时开启了 5 个容器

```shell
docker service ls   # 可以看到开启的负载均衡服务
docker ps   # 可以看到同时有5个容器在执行
```
