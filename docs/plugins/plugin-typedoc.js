/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * Configure docusaurus-plugin-typedoc for each package.
 * Requires typedoc@0.28 + typedoc-plugin-markdown@4.12 (peer of docusaurus-plugin-typedoc).
 */
function pluginTypedoc(directories) {
  return directories.map((directory) => {
    return [
      'docusaurus-plugin-typedoc',
      {
        // TypeDoc options — https://typedoc.org/documents/Options.html
        id: directory,
        entryPoints: [`../packages/${directory}/src/index.ts`],
        tsconfig: `../packages/${directory}/tsconfig.json`,
        out: `./docs/typedoc/${directory}`,
        readme: 'none',
        gitRevision: 'master',
        sourceLinkTemplate: 'https://github.com/sakitam-fdd/ol3Echarts/blob/{gitRevision}/{path}#L{line}',
        skipErrorChecking: true,
        excludeExternals: true,
        excludePrivate: true,
        excludeInternal: true,
        excludeProtected: true,
        hideGenerator: true,
        includeVersion: true,
        sort: ['source-order'],

        // Markdown theme options — https://typedoc-plugin-markdown.org
        // Do NOT add typedoc-plugin-markdown here again; docusaurus-plugin-typedoc loads it.
        hideBreadcrumbs: true,
        parametersFormat: 'table',
        enumMembersFormat: 'table',
        useCodeBlocks: true,

        // Docusaurus plugin options
        sidebar: {
          autoConfiguration: true,
          pretty: true,
        },
        watch: false,
      },
    ];
  });
}

module.exports = { pluginTypedoc };
