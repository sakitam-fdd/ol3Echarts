// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    project: 'tsconfig.json',
    ecmaFeatures: {
      "jsx": true
    },
    useJSXTextNode: true,
    extraFileExtensions: [".tsx"]
  },
  env: {
    browser: true
  },
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: [
    'react',
    'jsx-a11y',
    '@typescript-eslint',
  ],
  // add your custom rules here
  rules: {
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',

    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',

    'react/jsx-filename-extension': 0,
    'react/forbid-prop-types': 0,
    'react/require-default-props': 0,
    'react/no-array-index-key': 'off',
    'import/prefer-default-export': 0,
    'import/no-extraneous-dependencies': 'off',

    'class-methods-use-this': 'off',

    'no-plusplus': 0,
    'import/no-unresolved': 0,
    'no-param-reassign': 0,
    // allow global require
    'linebreak-style': 0,
    'global-require': 0,
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    'no-prototype-builtins': 0,
    'no-underscore-dangle': 0,
    'implicit-arrow-linebreak': 0,
    // allow debugger during development
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  },
  globals: {}
};
