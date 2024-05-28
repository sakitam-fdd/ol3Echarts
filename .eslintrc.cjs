module.exports = {
  root: true,
  extends: [
    '@aurorafe/eslint-config-ts',
  ],
  overrides: [
    {
      files: ['**/tests/unit/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ]
};
