# Frontend

## For Users

你需要在拉取仓库后在本地创建 `.env.local` 文件，并指定你的测试后端路径：

```
REACT_APP_BACKEND_URL=https://backend-dev-undefined.app.secoder.net
```

当然为防止测试环境发生数据大型丢失，你可以在本地拉取后端仓库后以 `sqlite3` 模式运行，并在这里填写你的本地后端回调地址。 


## For Developers

请先阅读[项目规范](https://qynt1gy8vn.feishu.cn/docs/doccnLXFY9wOriyviGh5fv6NUgd)，然后再继续阅读本部分。

+ IDE: `WebStorm:**latest**` (recommended)
  + Or `vscode` with `eslint` and `prettier` configurated

+ `yarn install` 补全 `node_modules`
+ `yarn start` 开启本地网页
+ `yarn fix` 使用 prettier 自动修复风格化问题
+ `yarn lint` 使用 eslint 检查是否存在格式问题

项目安装了 `.husky` pre-commit 钩子，在每次 commit 的时候自动运行 `yarn lint`，只有没有格式问题时才允许 commit.

在 push 之前请确保本地运行 `yarn lint` 与 `yarn build` 没有问题，不然就算是 push 了也过不了 CI 测试，不允 Pull Request.

关于 Slice 在不同 Route 之间同步，参见：
+ https://github.com/supasate/connected-react-router

### 前端项目路径规范

+ `assets` 存储静态资源
+ `Layout` 中放置基本的外观组件
+ `Components` 中放置功能组件的外表
+ `store` 中存储全局变量
  + `functions` 中存储与后端通信用函数
  + `slices` 中存储变量状态的 Slice
+ `page` 中存储功能部件
  + `Router.tsx` 全局路由
  + `route` 中存储不同的功能部件

`./page/route` 中的功能部件通过调用 `./store/` 中的 reducers / getter 读取/写入变量状态（与后端通信），然后将数据作为 props 给 `./components` 和 `./layout` 并将该组件 return，使其能够成功渲染。
