const path = require('path');
const fs = require('fs');

/**
 * Resolve a package root from the docs workspace, walking up from its main entry.
 */
function resolvePkgRoot(name) {
  const entry = require.resolve(name, { paths: [path.join(__dirname, '..')] });
  let dir = path.dirname(entry);
  while (dir !== path.dirname(dir)) {
    const pkgPath = path.join(dir, 'package.json');
    if (fs.existsSync(pkgPath) && JSON.parse(fs.readFileSync(pkgPath, 'utf8')).name === name) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  throw new Error(`Cannot resolve package root for ${name}`);
}

/**
 * Map package.json "exports" to absolute file aliases so webpack always uses one
 * physical copy (pnpm otherwise duplicates React contexts across peer trees).
 */
function aliasFromExports(name) {
  const root = resolvePkgRoot(name);
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const exportsMap = pkg.exports || { '.': pkg.main || 'index.js' };
  const aliases = {};

  for (const [subpath, target] of Object.entries(exportsMap)) {
    if (subpath.includes('*')) {
      // Directory prefix alias, e.g. "./lib/*" -> "<root>/lib"
      const exportDir = subpath.replace(/^\.\//, '').replace(/\/\*$/, '');
      const targetDir = String(typeof target === 'string' ? target : target.default)
        .replace(/^\.\//, '')
        .replace(/\/\*$/, '');
      aliases[`${name}/${exportDir}`] = path.join(root, targetDir);
      continue;
    }

    const resolvedTarget = typeof target === 'string' ? target : target.default;
    if (!resolvedTarget) continue;

    if (subpath === '.') {
      aliases[`${name}$`] = path.join(root, resolvedTarget);
    } else {
      aliases[`${name}/${subpath.replace(/^\.\//, '')}`] = path.join(root, resolvedTarget);
    }
  }

  return aliases;
}

module.exports = function () {
  return {
    name: 'plugin-overwrite-webpack',
    configureWebpack() {
      return {
        resolve: {
          alias: {
            '@src': path.resolve(__dirname, 'src'),
            ...aliasFromExports('@docusaurus/theme-common'),
            ...aliasFromExports('@docusaurus/plugin-content-docs'),
          },
        },
        // monorepo 下避免监听整个 pnpm store / 构建产物，降低 EMFILE 风险
        watchOptions: {
          ignored: [
            '**/node_modules/**',
            '**/.git/**',
            '**/dist/**',
            '**/.turbo/**',
            '**/coverage/**',
          ],
        },
        module: {
          rules: [
            {
              test: /\.m?js/,
              resolve: {
                fullySpecified: false,
              },
            },
          ],
        },
      };
    },
  };
};
