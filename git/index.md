# git 基础命令

- **设置姓名和邮箱地址**

  - `git config --global user.name "Firstname Lastname"`
  - `git config --global user.email "your_email@example.com"`
  - 一般会存贮信息到 `~/.gitconfig`

- **提高命令输出的可读性**

  - 将 color.ui 设置为 auto 可以让命令的输出拥有更高的可 读性
  - `git config --global color.ui auto`

- **创建 SSH Key**

  - `ssh-keygen -t rsa -C "your_email@example.com"`
  - `id_rsa` 文件是私有密钥，`id_rsa.pub` 是公开密钥

- **初始化仓库**

  - `git init`

- **查看仓库的状态**

  - `git status`

- **向暂存区中添加文件**

  - `git add`
  - 暂存区是提交之前的一个临时区域

- **保存仓库的历史记录**

  - `git commit -m 'first commit'`
  - `-m` 参数后的 "first commit"称作提交信息，是对这个提交的 概述。
  - 直接执行命令`git commit`,执行后编辑器就会启动
  - `-a`, git 就会自动把所有已经跟踪过的文件暂存起来一并提交

- **查看提交日志**

  - `git log`
  - 只要在 git log 命令后加上目录名，便会只显示该目录下的日志。 如果加的是文件名，就会只显示与该文件相关的日志
  - 可以加上 `-p` 参数，文件的前后差 别就会显示在提交信息之后。`git log -p`
  - `--graph` , 以图表形式查看分支
  - `git reflog`命令，查看当前仓库的操作日志

- **查看更改前后的差别**

  - `git diff`,查看当前工作树与暂存区的差别
  - `git diff HEAD`,查看工作树和最新提交的差别,这里的 HEAD 是指向当前分支中最新一次提交 的指针。

- **显示分支一览表**

  - `git branch`

- **切换分支**

  - `git checkout [branch name]`, 切换 `branch`,`tag`
  - `git checkout -b [new branch name]`, 创建新的分支名字，然后再切换分支
  - `git checkout -`, 切换回上一个分支

- **合并分支**

  1. 假设 `feature-A` 已经实现完毕
  2. 将它合并到主干分 支 `master` 中
  3. 首先切换到 `master` 分支
  4. `git checkout master`
  5. 然后合并 `feature-A` 分支
  6. `git merge feature-A`

- **回溯历史版本**

  - `git rest --hard [commit hash]` , 让仓库的 HEAD、暂存区、当前工作树回溯到指定状态

- **压缩历史**

  - 在合并特性分支之前，如果发现已提交的内容中有些许拼写错误等
  - 不妨提交一个修改，然后将这个修改包含到前一个提交之中，压缩成一 个历史记录

  1. 创建 feature-C 分支
  2. git checkout -b feature-C
  3. 开发并提交内容
  4. git commit -am "Add feature-C"
  5. 修正拼写错误
  6. 修改后再提交
  7. git commit -am "Fix typo"
  8. 更改历史
  9. 在历史记录中合并为一次完美的提交
  10. git rebase -i HEAD~2
  11. `pick 7a34294 Add feature-C pick 6fba227 Fix typo`
  12. 我们将 6fba227 的 Fix typo 的历史记录压缩到 7a34294 的 Add feature-C 里
  13. 将 6fba227 左侧的 pick 部分删除，改写为 fixup。
  14. `pick 7a34294 Add feature-C fixup 6fba227 Fix typo`
  15. 系统显示 rebase 成功。也就是以下面这两个提交作为对象，将 "Fix typo"的内容合并到了上一个提交 "Add feature-C"中，改写成了一个新 的提交。
  16. feature-C 分支的使命告一段落，我们将它与 master 分支合并
  17. git checkout master
  18. git merge feature-C

- **添加远程仓库**

  - `git remote add origin git@github.com:github-book/git-tutorial.git`

- **推送至远程仓库**
  - `git push origin master`
  - `-u` 参数可以在推送的同时，将 origin 仓库的 master 分 支设置为本地仓库当前分支的 upstream(上游)。添加了这个参数，将来 运行 git pull 命令从远程仓库获取内容时，本地仓库的这个分支就可 以直接从 origin 的 master 分支获取内容，省去了另外添加参数的麻烦

```
git init
git add .
git add [file name]
// 启动默认编辑器，输入提交说明
// git config --global core.editor 命令可以设定编辑器
git commit
git commit -m 'someting text'
// -a, git 就会自动把所有已经跟踪过的文件暂存起来一并提交
git commit -a -m 'test'
// git rm log/\*.log
git rm [file name]
// --cached, 也就是从将已经跟踪的文件去除跟踪，即删除暂存区的文件，但是在工作区，该文件还是存在的
git rm --cached [file name]
git mv [file from] [file to]
git clone [git url]
git status
// -p 选项展开显示每次提交的内容差异
// -2 则仅显示最近的两次更新
// --stat，仅显示简要的增改行数统计
// --pretty,可以指定使用完全不同于默认格式的方式展示提交历史,oneline,short，format,full 和fulle
git log
// 工作区和暂存区之间的差异
git diff
// 暂存区和上次提交的快照
git diff --cached
// 同上
git diff --staged
// 取消暂存
git reset HEAD [file name]
// 恢复到之前的版本
git checkout -- [file name]
// 添加远程库,shortname 指代 url
git remote add [shortname] [url]
git fetch [remote-name]
git push [remote-name] [branch-name]
// 查看某个远程仓库的详细信息
git remote show [remote-name]
// 修改某个远程仓库在本地的简短名称
git remote rename dev dev2
// 删除远程仓库在本地的应用
git remote rm dev2
// 列出所有标签
git tag
// 匹配特定标签
git tag -l 'v1.4.2.*'
// 新建标签,-a,标签名字,-m,标签的说明
git tag -a v1.0 -m '1.0 version'
// git show 命令查看相应标签的版本信息，并连同显示打标签时的提交对象
git show v1.0
git push origin [tagname]
// 推送所有标签
git push origin --tags
// delete branch
git branch -d [branch name]
git merge
git rebase
```

### branch

```
// list all branch
git branch
// new branch name
git branch [branch name]
// 切换到指定分支
git checkout [branch name]
// 创建并切换
git checkout -b [branch name]
```

## gitignore

```
glob 模式
# 此为注释 – 将被 Git 忽略
*.a       # 忽略所有 .a 结尾的文件
!lib.a    # 但 lib.a 除外
/TODO     # 仅仅忽略项目根目录下的 TODO 文件，不包括 subdir/TODO
build/    # 忽略 build/ 目录下的所有文件
doc/*.txt # 会忽略 doc/notes.txt 但不包括 doc/server/arch.txt
```
