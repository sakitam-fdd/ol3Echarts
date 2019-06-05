module.exports = {
  presets: [
    ['@babel/env', {
      targets: {
        browsers: ['> 1%', 'last 2 versions', 'not ie <= 8'],
      },
      loose: true,
      modules: false,
    }],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    [
      '@babel/plugin-proposal-decorators',
      { legacy: true },
    ],
    [
      '@babel/plugin-proposal-class-properties', // 兼容class内的箭头函数
      { loose: true },
    ],
    // '@babel/external-helpers',
    'react-hot-loader/babel',
  ],
  ignore: [
    '_site/*.js',
  ],
  comments: false,
};
