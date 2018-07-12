# docker 网络侨联

## 自定义网络

docker 容器之间默认是隔离的,无法通过 ip 地址互相访问
如果我们想要容器之间访问,就需要通过`docker network create`创建一个新的网络,然后容器使用`--network`参数使用同一个网络,来进行互联

```shell
docker network create -d bridge my-net
```

-d 参数指定 docker 网络驱动类型

```shell
run -it --rm --name bash1 --network my-net bash
run -it --rm --name bash2 --network my-net bash
```

开启两个容器都使用同一个网络

进入第一个 bash

```shell
docker attach
ping bash2  # 成功
```

## 使用 docker-compose

```shell
docker-compose up
```
