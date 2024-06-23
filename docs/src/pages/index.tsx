import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './index.module.css';

const features = [
  {
    title: 'Easy to use?',
    description: (
      <>
        I'm not sure whether it is easy to use. It comes from three.js. There are many similar designs, but it is more
        concise.
      </>
    ),
  },
  {
    title: 'High-performance?',
    description: (
      <>I'm not sure whether the performance is better. It's a toy, but I will try my best to optimize it.</>
    ),
  },
  {
    title: 'Flexible',
    description: <>Easy to expand, I will try my best to ensure its scalability.</>,
  },
];

function Feature({ title, description }) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <div className="text--center">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} }: any = context;
  return (
    <Layout title={`${siteConfig.title}`} description="Description will go into a meta tag in <head />">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <img
            className={clsx(styles.heroBannerLogo, 'margin-vert--md')}
            alt={`${siteConfig.title} logo`}
            src={useBaseUrl('images/logo.png')}
          />
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link className={clsx('button button--secondary button--lg', styles.getStarted)} to={useBaseUrl('docs/')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map(({ title, description }) => (
                  <Feature key={title} title={title} description={description} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}
