# Frontend

## For Users

// TODO: 这里讲解配置文件格式

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
