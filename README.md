首先，你需要确保本地安装了node.js(node version 10)，然后，执行下面命令安装项目依赖：

```bash
npm install
```

接着，启动下面命令会自动打开页面，修改内容页面也自动刷新：

```bash
npm run dev
```

如果你想发布开发的代码，执行下面命令进行打包：

```bash
npm run build
```

如何作为npm包发布和使用？
========================================

发布
----------------------------------------

- 第一步：registry

```bash
npm config set registry http://61.155.2.142:82/repository/npm-local/
```

- 第二步：登录

```bash
npm login
```

- 第三步：发布

```bash
npm publish
```

使用
----------------------------------------
- 第一步：registry

```bash
npm config set registry http://61.155.2.142:82/repository/npm-public/
```

- 第二步：安装

```bash
npm install -g pteller-pkg
```

- 第三步：恢复registry

```bash
npm config set registry https://registry.npmjs.org/
```

- 第四步：添加配置文件

在需要打包的项目中添加如下配置文件(假如这里文件名称是pteller.config.js)。

你可以使用下面命令自动创建：

```bash
pteller --init [可选，配置文件名称，默认就是pteller.config.js]
```

当然，你直接使用命令行配置也可以，请使用下面命令查看帮助：

```bash
pteller --help
```

- 第五步：运行

```bash
pteller --config ./pteller.config.js
```
=======
# ve-template

#### 介绍
一个依赖于ve工具的generator

#### 软件架构
软件架构说明


#### 安装教程

1.  xxxx
2.  xxxx
3.  xxxx

#### 使用说明

1.  xxxx
2.  xxxx
3.  xxxx

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解 Gitee 上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是 Gitee 最有价值开源项目，是综合评定出的优秀开源项目
5.  Gitee 官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  Gitee 封面人物是一档用来展示 Gitee 会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)
