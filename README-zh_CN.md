# babel-plugin-umi-model

该插件用于自动引入`umi`的`useModel`中的第二个参数,移除掉不使用的值，避免组件重复渲染带来性能损失

[![NPM version](https://img.shields.io/npm/v/babel-plugin-umi-model.svg?style=flat)](https://npmjs.org/package/babel-plugin-umi-model)

[English](./README.md) | 简体中文

## 📦 安装

```
npm i babel-plugin-umi-model --save-dev
```

or

```
pnpm add babel-plugin-umi-model -D
```

## 🔨 用法

### 常规使用

```javascript
import { useModel } from "umi";

const { userInfo, token } = useModel("user");
```

⬇️

```javascript
import { useModel } from "umi";

const { userInfo, token } = useModel("user", (model) => ({
  userInfo: model.userInfo,
  token: model.token,
}));
```

## 🖥 配置

### 1. .babelrc

`umi3` 和 `umi4` 版本通用

`.env` 文件记得配置 `BABELRC=true`

```
{
  "plugins": [
    "umi-model"
  ]
}
```

### 2. extraBabelPlugins

`umi3` 和 `umi4` 版本通用

```js
import { defineConfig } from "umi";
// import BabelPluginUmiModel from 'babel-plugin-umi-model'

export default defineConfig({
  extraBabelPlugins: [
    "umi-model",
    // [
    //   "umi-model",
    //     {
    //       extensions: [".jsx", ".tsx"],
    //       excludes: ['node_modules', 'src/.umi', 'src/.umi-production'],
    //     },
    //   ],
    // ],
    // BabelPluginUmiModel
  ],
});
```

### 3. plugins

#### umirc.js

```js
import { defineConfig } from "umi";

export default defineConfig({
  plugins: ["./plugin-test"],
});
```

#### plugin-test.ts

```ts
import { IApi } from "umi";

export default (api: IApi) => {
  api.addBeforeBabelPlugins(() => {
    return ["umi-model"];
  });
};
```

## 参数

### `extensions`

- **类型:** `string[]`
- **默认值:** `['.jsx', '.tsx']`

### `excludes`

- **类型:** `string[]`
- **默认值:** `['node_modules', 'src/.umi', 'src/.umi-production']`
