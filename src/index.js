import _path from "path";

const DEFAULT_OPTIONS = Object.freeze({
  EXTENSIONS: [".jsx", ".tsx"],
  EXCLUDES: ["node_modules", "src/.umi", "src/.umi-production"],
});

function checkExtensions(state) {
  const opts = state && state.opts ? state.opts : {};
  const filename = state && state.filename ? state.filename : "";
  if (!filename) return false;
  const extensions = opts.extensions || DEFAULT_OPTIONS.EXTENSIONS;
  const extname = _path.extname(filename);
  return extensions.includes(extname);
}

function checkExcludes(state) {
  const opts = state && state.opts ? state.opts : {};
  const filename = state && state.filename ? state.filename : "";
  if (!filename) return false;
  const excludes = opts.excludes || DEFAULT_OPTIONS.EXCLUDES;
  const suffixFilePath = filename.replace(process.cwd(), "");
  return !excludes.some((key) => suffixFilePath.indexOf(key) > -1);
}

export default function (babel) {
  const { types: t } = babel;
  let valid = true;
  const createObjectProperty = (key, value, objName) =>
    t.ObjectProperty(
      t.Identifier(key),
      t.memberExpression(t.Identifier(objName), t.Identifier(value))
    );

  const visitor = {
    Program: {
      enter(path, state) {
        if (!checkExtensions(state)) {
          valid = false;
          return;
        }
        if (!checkExcludes(state)) {
          valid = false;
          return;
        }
        return false;
      },
      exit() {
        valid = true;
        return false;
      },
    },
    CallExpression(path, state) {
      if (!valid) return;

      if (!path.parent.id) return;

      const parentIdName = path.parent.id.name;
      // umi3babel 回调兼容
      if (parentIdName === "_useModel") {
        const declarations = (path.parentPath.parent.declarations || []).slice(
          1
        );

        if (path.node.arguments[1]) return;

        const list = [];
        for (let item of declarations) {
          const name = item.init.property.name;
          list.push(createObjectProperty(name, name, "model"));
        }
        path.node.arguments.push(
          t.ArrowFunctionExpression(
            [t.Identifier("model")],
            t.ObjectExpression(list)
          )
        );
        return;
      }

      if (path.node.callee.name !== "useModel") return;

      const properties = path.parent.id.properties || [];

      if (properties.length === 0) return;

      const arrowFunctionObject = path.node.arguments[1];
      // 箭头函数存在
      if (arrowFunctionObject) {
        const modelName = arrowFunctionObject.params[0].name;
        const bodyProperties = arrowFunctionObject.body.properties || [];

        for (let property of properties) {
          const key = property.key.name;
          // const value = property.value.name;

          const bodyPropertyIndex = bodyProperties.findIndex(
            (item) => item.key.name === key
          );

          if (bodyPropertyIndex > -1) continue;

          path.node.arguments[1].body.properties.push(
            createObjectProperty(key, key, modelName)
          );
        }

        return;
      }

      // 箭头函数不存在
      const list = [];

      for (let property of properties) {
        const key = property.key.name;
        // const value = property.value.name;
        list.push(createObjectProperty(key, key, "model"));
      }

      if (list.length === 0) return;

      path.node.arguments.push(
        t.ArrowFunctionExpression(
          [t.Identifier("model")],
          t.ObjectExpression(list)
        )
      );
    },
  };

  return {
    visitor,
  };
}
