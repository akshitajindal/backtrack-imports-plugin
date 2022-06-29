[![node][node]][node-url]
[![npm][npm]][npm-url]

<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <h1>Backtrack Imports Plugin</h1>
  <p>Visualize the import paths of any module in accordance with  selected chunks using an interactive tree.</p>
</div>

<h2 align="center">Install</h2>

```bash
# NPM
npm install backtrack-imports-plugin

# Yarn
yarn add backtrack-imports-plugin
```

<h2 align="center">Usage (as a plugin)</h2>

```js
// webpack.config.js
const { BacktrackImportsPlugin } = require("backtrack-imports-plugin");
module.exports = {
    plugins: [new BacktrackImportsPlugin()],
};

// next.config.js
module.exports = (nextConfig = {}) =>
    Object.assign({}, nextConfig, {
        webpack(config, options) {
            const BacktrackImportsPlugin =
                require("backtrack-imports-plugin").BacktrackImportsPlugin;
            config.plugins.push(new BacktrackImportsPlugin({}));

            return config;
        },
    });
```

### Backtrack-Imports-Plugin creates an interactive tree visualization of the imports path for the selected module.

![GIF of Backtrack-Imports-Plugin](./public/93f72404-b338-11e6-92d4-9a365550a701.gif)

### This module will help you:

1. Realize the imports structure between various files.
2. Get the size of each file through the interactive tree.
3. Find the undesirable imports.
4. Check if there is a circular dependency in the import paths of any module.

[node]: https://img.shields.io/badge/node-%3E%3D%20v14.17.0-blue
[node-url]: https://npmjs.com/package/webpack-bundle-analyzer
[npm]: https://img.shields.io/badge/npm-%3E%3D%20v6.14.13-orange
[npm-url]: https://npmjs.com/package/webpack-bundle-analyzer
