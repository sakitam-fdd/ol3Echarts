// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    // parser: 'babel-eslint',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    project: 'tsconfig.json',
    // tsconfigRootDir: './packages/ol-echarts/'
  },
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended'
  ],
  settings: {},
  plugins: [
    '@typescript-eslint',
  ],
  // add your custom rules here
  rules: {
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',

    'max-len': ['error', { 'code': 150 }],
    'no-shadow': 0,
    'func-names': 0,

    'no-unused-expressions': ['error', { 'allowShortCircuit': true }],
    'no-restricted-properties': 'off',
    'array-callback-return': 'off',
    'prefer-destructuring': 'off',

    'import/named': 0,
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    'no-plusplus': 0,
    'import/no-unresolved': 0,
    'no-param-reassign': 0,

    'class-methods-use-this': 0,

    // allow global require
    'linebreak-style': 0,
    'indent': 0,

    'global-require': 0,
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    'no-prototype-builtins': 0,
    'no-underscore-dangle': 0,
    'implicit-arrow-linebreak': 0,
    'no-console': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  },
  globals: {}
};
