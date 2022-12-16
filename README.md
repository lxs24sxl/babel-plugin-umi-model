# babel-plugin-umi-model

This plugin is used to automatically introduce the second parameter in `umi`'s `useModel`, removing the unused value and avoiding the performance loss caused by repeated rendering of the component.

[![NPM version](https://img.shields.io/npm/v/babel-plugin-umi-model.svg?style=flat)](https://npmjs.org/package/babel-plugin-umi-model)

[English](./README.md) | 简体中文

## 📦 Install

```
npm i babel-plugin-umi-model --save-dev
```

or

```
pnpm add babel-plugin-umi-model -D
```

## 🔨 Usage

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

## 🖥 Config

### 1. .babelrc

This configuration is common to `umi3` and `umi4` versions

Remember to configure the `.env` file with `BABELRC=true`

```
{
  "plugins": [
    "umi-model"
  ]
}
```

### 2. extraBabelPlugins

This configuration is common to `umi3` and `umi4` versions

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

## Options

### `extensions`

- **Type:** `string[]`
- **Default:** `['.jsx', '.tsx']`

### `excludes`

- **Type:** `string[]`
- **Default:** `['node_modules', 'src/.umi', 'src/.umi-production']`
