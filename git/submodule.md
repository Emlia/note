# git submodule
## 添加submodule
    git submodule add [git name] library
## 更新submodule
### 在父目录下
    git submodule foreach git pull
### 在submodule的目录下
    git pull
## clone submodule
### 连同submodule一起clone下来
    采用递归参数 --recursive
    git clone [git name] --recursive
### 先clone父项目，再初始化Submodule
    git submodule init
## 删除Submodule
    git rm [submodule name]

