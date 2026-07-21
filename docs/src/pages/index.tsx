import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './index.module.css';

const features = [
  {
    marker: '01',
    title: '原生坐标桥接',
    description: '自动注册 OpenLayers 坐标系，把经纬度稳定映射到 ECharts 像素空间。',
  },
  {
    marker: '02',
    title: '完整视图同步',
    description: '平移、缩放、旋转与容器尺寸变化都能触发精确重绘，并保留图表交互。',
  },
  {
    marker: '03',
    title: '现代 TypeScript API',
    description: '支持 OpenLayers 7–10、ECharts 5/6，以及 Vite、Webpack 和 Rollup。',
  },
];

const demos = [
  { title: '迁徙路线', detail: 'lines + effectScatter', href: '/docs/playgrounds/migration', tone: 'cyan' },
  { title: '海量散点', detail: 'scatter + event bridge', href: '/docs/playgrounds/scatter-charts', tone: 'violet' },
  { title: '地图饼图', detail: 'coordinate anchored pie', href: '/docs/playgrounds/pie', tone: 'amber' },
] as const;

const code = `const layer = new EChartsLayer(option, {
  hideOnMoving: true,
  hideOffscreenLabels: true,
});

layer.appendTo(map);`;

export default function Home() {
  return (
    <Layout
      title="OpenLayers × Apache ECharts"
      description="ol-echarts 将 Apache ECharts 图表叠加到 OpenLayers 地图，并自动同步坐标与视图。"
    >
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroGlow} />
          <div className={`container ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <div className={styles.badge}>
                <span className={styles.badgeDot} />
                ol-echarts 4 · TypeScript
              </div>
              <h1>
                让地图坐标与
                <span>ECharts 视图</span>
                保持同步
              </h1>
              <p>
                面向现代 OpenLayers 的轻量桥接层。无需维护第二套坐标换算，直接使用熟悉的 ECharts option 构建地图可视化。
              </p>
              <div className={styles.actions}>
                <Link className={styles.primaryAction} to="/docs/quickstart">
                  5 分钟快速开始 <span aria-hidden="true">→</span>
                </Link>
                <Link className={styles.secondaryAction} to="/docs/playgrounds/scatter-charts">
                  浏览在线示例
                </Link>
              </div>
              <div className={styles.compatibility}>
                <span>OL 7–10</span>
                <span>ECharts 5/6</span>
                <span>ESM · CJS · UMD</span>
              </div>
            </div>

            <div className={styles.preview} aria-label="ol-echarts code example">
              <div className={styles.previewBar}>
                <div className={styles.windowDots}>
                  <i />
                  <i />
                  <i />
                </div>
                <span>map-layer.ts</span>
                <span className={styles.previewStatus}>● synced</span>
              </div>
              <div className={styles.mapVisual}>
                <div className={styles.mapGrid} />
                <span className={`${styles.node} ${styles.nodeOne}`} />
                <span className={`${styles.node} ${styles.nodeTwo}`} />
                <span className={`${styles.node} ${styles.nodeThree}`} />
                <svg viewBox="0 0 560 230" role="presentation">
                  <path d="M92 163 C 190 62, 342 52, 467 112" />
                  <path d="M92 163 C 224 224, 350 197, 467 112" />
                </svg>
                <img src={useBaseUrl('images/logo.png')} alt="" className={styles.mapLogo} />
              </div>
              <pre className={styles.code}>
                <code>{code}</code>
              </pre>
            </div>
          </div>
        </section>

        <section className={`container ${styles.features}`}>
          <div className={styles.sectionHeading}>
            <span>WHY OL-ECHARTS</span>
            <h2>专注桥接，保持两端原生能力</h2>
          </div>
          <div className={styles.featureGrid}>
            {features.map((feature) => (
              <article key={feature.marker} className={styles.featureCard}>
                <span>{feature.marker}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`container ${styles.demoSection}`}>
          <div className={styles.sectionHeading}>
            <span>PLAYGROUNDS</span>
            <h2>从真实场景开始</h2>
          </div>
          <div className={styles.demoGrid}>
            {demos.map((demo, index) => (
              <Link key={demo.title} className={`${styles.demoCard} ${styles[demo.tone]}`} to={demo.href}>
                <div className={styles.demoIndex}>0{index + 1}</div>
                <div>
                  <h3>{demo.title}</h3>
                  <p>{demo.detail}</p>
                </div>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
