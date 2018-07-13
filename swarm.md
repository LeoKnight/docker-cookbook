# docker swarm

docker swarm 提供了 docker 集群服务

```shell
Commands:
  ca          Display and rotate the root CA
  init        Initialize a swarm
  join        Join a swarm as a node and/or manager
  join-token  Manage join tokens
  leave       Leave the swarm
  unlock      Unlock swarm
  unlock-key  Manage the unlock key
  update      Update the swarm
```

使用上一章的方式,我们创建两个 docker 实例, 分别叫 demo, demo2

在本地 docker 实例中执行

```shell
docker swarm init # 使当前节点作为管理节点


To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-5q8cbeppz0lmjvzoh65ah2nplcyl0u5lih9t3010k4xwsk580f-ea666p0d1kxlybmrvcjwecxpa 192.168.65.3:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.
```
