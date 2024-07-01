const path = require('path');

const darkCodeTheme = require('prism-react-renderer/themes/vsDark');
const lightCodeTheme = require('prism-react-renderer/themes/vsLight');
const { pluginTypedoc } = require('./plugins/plugin-typedoc');

const BASE_URL = '/ol-echarts';

module.exports = {
  title: 'ol-echarts Documentation',
  tagline: 'a openlayers extension to echarts',
  url: 'https://sakitam-fdd.github.io',
  baseUrl: `${BASE_URL}/`,
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'images/logo.png',
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
          // versions: {
          //   current: {
          //     label: '4.x',
          //     // path: 'v4',
          //     badge: true,
          //     // className: 'v4',
          //     banner: 'unreleased',
          //   },
          //   '3.x': {
          //     label: '3.x',
          //     path: 'v3',
          //     badge: true,
          //     banner: 'unmaintained',
          //   },
          // },
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
          customCss: require.resolve('./styles/custom.css'),
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
        src: 'images/logo.png',
      },
      items: [
        {
          to: 'docs',
          // activeBasePath: 'docs',
          activeBaseRegex: 'docs(/?)$',
          label: 'Docs',
          position: 'right',
        },
        {
          to: 'playground',
          activeBasePath: 'playground',
          label: 'Playground',
          position: 'right',
        },
        {
          href: 'https://github.com/sakitam-fdd/ol-echarts',
          position: 'right',
          className: 'header-social-link header-github-link',
          'aria-label': 'GitHub',
        },
        {
          type: 'search',
          position: 'left',
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
              label: 'Playgrounds',
              to: 'docs/playgrounds/scatter-charts',
            },
            {
              label: 'API Reference',
              to: 'docs/typedoc/ol-echarts/',
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
      // contextualSearch: true,
    },
    announcementBar: {
      id: 'actions',
      content: "🚀 ol echarts for openlayers.",
      backgroundColor: 'var(--ifm-color-primary-dark)',
      textColor: '#ffffff',
      isCloseable: true,
    },
  },
  plugins: [
    path.resolve(__dirname, './plugins/plugin-overwrite-webpack.js'),
    path.resolve(__dirname, './plugins/plugin-tailwindcss.js'),
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
    ...pluginTypedoc(['ol-echarts', 'ol3-echarts']),
  ],
  themes: [
    '@docusaurus/theme-live-codeblock',
    // path.resolve(__dirname, './node_modules/@docusaurus/theme-search-algolia'),
  ],
  clientModules: [require.resolve('./docusaurus.theme.js')],
  customFields: {},
};
