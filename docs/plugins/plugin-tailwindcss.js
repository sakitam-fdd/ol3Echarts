module.exports = () => {
  return {
    name: 'plugin-tailwindcss',
    configurePostCss(postcssOptions) {
      /* eslint-disable @typescript-eslint/no-var-requires */
      postcssOptions.plugins.push(require('tailwindcss'));
      postcssOptions.plugins.push(require('autoprefixer'));
      if (process.env.NODE_ENV === 'production') {
        postcssOptions.plugins.push(require('cssnano'));
      }
      /* eslint-enable @typescript-eslint/no-var-requires */
      return postcssOptions;
    },
  };
};
