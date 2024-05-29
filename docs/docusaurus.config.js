const path = require('path');

const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const lightCodeTheme = require('prism-react-renderer/themes/github');

const BASE_URL = '/ol-echarts';

module.exports = {
  title: 'ol-echarts Documentation',
  tagline: 'a openlayers extension to echarts',
  url: 'https://sakitam-fdd.github.io',
  baseUrl: `${BASE_URL}/`,
  // baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'images/logo.svg',
  organizationName: 'sakitam-fdd',
  projectName: 'ol-echarts',
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },
  // trailingSlash: false,
  // scripts: [],
  // stylesheets: [],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars/docs.sidebars.js'),
          editUrl: 'https://github.com/sakitam-fdd/ol3Echarts/edit/master/documents/docs',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          breadcrumbs: true,
          // remarkPlugins: [],
          lastVersion: 'current',
        },
        blog: {
          // path: "./blog", // 路径
          // routeBasePath: "/blog",
          showReadingTime: true,
          sortPosts: 'descending', // 排序方向, 倒叙
          blogSidebarCount: 'ALL',
          blogSidebarTitle: '最近内容', // 博客侧边栏的标题
          // remarkPlugins: [],
          // https://docusaurus.io/zh-CN/docs/blog#feed
          feedOptions: {
            type: 'all',
            copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc.`,
            createFeedItems: async (params) => {
              const { blogPosts, defaultCreateFeedItems, ...rest } = params;
              return defaultCreateFeedItems({
                // 仅保留提要中的 10 篇最新博客文章
                blogPosts: blogPosts.filter((item, index) => index < 10),
                ...rest,
              });
            },
          },
        },
        theme: {
          customCss: require.resolve('./css/custom.css'),
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      },
    ],
  ],
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
    },
    docs: {
      sidebar: {
        hideable: false, // 可隐藏侧边栏
        autoCollapseCategories: true, // 自动折叠侧边栏类别
      },
    },
    // seo 相关
    metadata: [
      {
        name: 'keywords',
        content: 'openlayers, ol, echarts, webgis, viz',
      },
    ],
    liveCodeBlock: {
      /**
       * The position of the live playground, above or under the editor
       * Possible values: "top" | "bottom"
       */
      playgroundPosition: 'top',
    },
    navbar: {
      title: 'ol-echarts',
      hideOnScroll: true, // 自动隐藏顶部导航栏
      logo: {
        alt: 'ol-echarts',
        src: 'images/logo.svg',
      },
      items: [
        {
          to: 'docs',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'right',
        },
        {
          to: 'api',
          activeBasePath: 'api',
          label: 'API',
          position: 'right',
        },
        {
          href: 'https://github.com/sakitam-fdd/ol-echarts',
          label: 'GitHub',
          position: 'right',
        },
        {
          type: 'search',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: 'docs',
            },
            {
              label: 'API Reference',
              to: 'api',
            },
            {
              label: 'Playground',
              to: 'docs/playground',
            },
          ],
        },
        {
          title: 'Changelog',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/sakitam-fdd/ol3Echarts/blob/master/CHANGELOG.md',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/sakitam-fdd/ol3Echarts',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} sakitam-fdd. Built with Docusaurus.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ['javascript', 'jsx', 'typescript', 'tsx'],
    },
    algolia: {
      appId: '7HSJME72X5',
      apiKey: '867f56d90de9d14dbb4cd3d0928ff13f',
      indexName: 'ol-echarts',
      contextualSearch: true,
    },
  },
  plugins: [
    path.resolve(__dirname, './plugins/plugin-overwrite-webpack.js'),
    // 图片处理插件（响应式、懒加载及低像素占位图）
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1030,
        min: 640,
        steps: 2,
        disableInDev: false,
      },
    ],
    [
      'docusaurus-plugin-typedoc',
      {
        sidebar: { sidebarFile: null },
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'api',
        path: 'api',
        routeBasePath: 'api',
        sidebarPath: require.resolve('./sidebars/api.sidebars.js'),
        editUrl: 'https://github.com/sakitam-fdd/ol3Echarts/edit/master/documents/docs',
      },
    ],
  ],
  themes: [
    '@docusaurus/theme-live-codeblock',
    // path.resolve(__dirname, './node_modules/@docusaurus/theme-search-algolia'),
  ],
  customFields: {},
};
