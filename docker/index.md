# docker 命令

## docker
- docker --version
- docker run hello-world
- docker version


## docker image
- docker image ls
- more Dockerfile
- docker pull ubuntu // 拉取镜像,hub.docker.com


## docker machine
- docker-machine --version
- docker-machine create demo // 创建docker的一个linux虚拟机,需要virtual box
- docker-machine rm demo // shanchu 
- docker-machine ls // 查看所有
- docker-machine ssh demo // 进入 demo 虚拟机
- docker-machine start demo // 启动
- docker-machine stop demo // 停止
- docker-machine env demo // 导出 demo 的环境变量
- eval $(docker-machine env demo) // 导出
- eval $(docker-machine env --unset) // 清空



 ## linux
- ps -ef | grep docker