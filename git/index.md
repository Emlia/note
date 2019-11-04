# git 基础命令
## 常见
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
