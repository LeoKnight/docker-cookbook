# docker-machine

docker-machine 使用来制作 docker 虚拟机,可以使一台主机开启多个 docker 实例,便于开发阶段调试
此教程适用于 mac 系统,docker-machine 默认使用 `Virtualbox` 驱动,mac 系统推荐使用 `xhyve`驱动

```shell
brew install docker-machine-driver-xhyve    # 安装xhyve驱动

# 需要为添加权限
sudo chown root:wheel $(brew --prefix)/opt/docker-machine-driver-xhyve/bin/docker-machine-driver-xhyve
sudo chmod u+s $(brew --prefix)/opt/docker-machine-driver-xhyve/bin/docker-machine-driver-xhyve
```

创建虚拟 docker vm
首次安装需要去[boot2docker](https://github.com/boot2docker/boot2docker/releases/) release 页面通过代理手动下载,这样会比较快,因为通过 docker-machine 的默认安装方式国内安装会非常的慢

```shell
# 下载完的boo2docker.iso 需要放到~/.docker/machine/cache/路径下
mv [你的boo2docker.iso路径] ~/.docker/machine/cache/

docker-machine create \
      -d xhyve \
      --xhyve-boot2docker-url ~/.docker/machine/cache/boot2docker.iso \
      --engine-opt dns=114.114.114.114 \
      --engine-registry-mirror https://registry.docker-cn.com \
      --xhyve-memory-size 2048 \
      --xhyve-rawdisk \
      --xhyve-cpu-count 2 \
      demo  #虚拟机名字
```

安装完成之后可以通过`env`设置后续操作的目标主机

```shell
docker-machine ls   # 查看实例是否启动成功

NAME   ACTIVE   DRIVER   STATE     URL                       SWARM   DOCKER        ERRORS
demo   -        xhyve    Running   tcp://192.168.64.3:2376           v18.05.0-ce

docker-machine env demo # 设置目标主机

docker-machine ssh demo # 登陆主机
```
