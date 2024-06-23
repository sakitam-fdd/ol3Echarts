/* eslint-disable @typescript-eslint/no-var-requires */

function pluginTypedoc(directories) {
  const withEntryPoints = directories.map((directory) => {
    // const pkgJson = JSON.parse(fs.readFileSync(path.join(__dirname, `../packages/${directory}/package.json`), 'utf-8'));

    const entrypoints = ['./index.ts'];
    return {
      directory,
      entrypoints,
    };
  });

  return withEntryPoints.map((opts, idx) => {
    const { directory, entrypoints } = opts;
    return [
      'docusaurus-plugin-typedoc',
      {
        // TypeDoc options
        // https://typedoc.org/guides/options/
        skipErrorChecking: true,
        id: directory,
        gitRevision: 'master',
        sourceLinkTemplate: 'https://github.com/sakitam-fdd/ol3Echarts/blob/{gitRevision}/{path}#L{line}',
        entryPoints: entrypoints.map((it) => `../packages/${directory}/src/${it}`),
        tsconfig: `../packages/${directory}/tsconfig.json`,
        out: `./docs/typedoc/${directory}`,
        readme: 'none',
        excludeExternals: true,
        excludePrivate: true,
        excludeInternal: true,
        excludeProtected: true,
        hideGenerator: true,
        includeVersion: true,
        hideBreadcrumbs: true,
        sort: ['source-order'],

        plugin: ['typedoc-plugin-markdown', 'typedoc-plugin-not-exported'],

        // docusaurus-plugin-typedoc options
        // https://github.com/tgreyuk/typedoc-plugin-markdown/tree/master/packages/docusaurus-plugin-typedoc#plugin-options
        sidebar: {
          categoryLabel: `${directory}`,
          position: idx,
          pretty: true,
        },

        parametersFormat: 'table',
        enumMembersFormat: 'table',
        useCodeBlocks: true,

        // Markdown options
        // https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs#markdown-front-matter
        // frontmatterGlobals: {
        //   pagination_prev: null,
        //   pagination_next: null,
        //   custom_edit_url: null,
        // },
      },
    ];
  });
}

module.exports = { pluginTypedoc };
