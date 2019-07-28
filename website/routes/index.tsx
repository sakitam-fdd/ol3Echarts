import 'ol/ol.css';
import '../assets/style/art.less';

import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
// @ts-ignore
import loadable from '@loadable/component';

const mainRouter = [
  {
    name: 'index',
    key: 'index',
    route: {
      path: '/index',
      component: loadable(() => import(/* webpackChunkName: 'index' */ '../pages/index')),
    },
  },
  {
    name: 'scatter',
    key: 'scatter',
    route: {
      path: '/scatter',
      component: loadable(() => import(/* webpackChunkName: 'scatter' */ '../pages/scatter')),
    },
  },
  {
    name: 'migration',
    key: 'migration',
    route: {
      path: '/migration',
      component: loadable(() => import(/* webpackChunkName: 'migration' */ '../pages/migration')),
    },
  },
  {
    name: 'lineBus',
    key: 'lineBus',
    route: {
      path: '/lineBus',
      component: loadable(() => import(/* webpackChunkName: 'lineBus' */ '../pages/lineBus')),
    },
  },
  {
    name: 'traffic',
    key: 'traffic',
    route: {
      path: '/traffic',
      component: loadable(() => import(/* webpackChunkName: 'traffic' */ '../pages/traffic')),
    },
  },
  {
    name: 'chinaMigration',
    key: 'chinaMigration',
    route: {
      path: '/chinaMigration',
      component: loadable(() => import(/* webpackChunkName: 'chinaMigration' */ '../pages/chinaMigration')),
    },
  },
  {
    name: 'bar',
    key: 'bar',
    route: {
      path: '/bar',
      component: loadable(() => import(/* webpackChunkName: 'bar' */ '../pages/bar')),
    },
  },
  {
    name: 'pie',
    key: 'pie',
    route: {
      path: '/pie',
      component: loadable(() => import(/* webpackChunkName: 'pie' */ '../pages/pie')),
    },
  },
  {
    name: 'line',
    key: 'line',
    route: {
      path: '/line',
      component: loadable(() => import(/* webpackChunkName: 'line' */ '../pages/line')),
    },
  },
  {
    name: 'heatmap',
    key: 'heatmap',
    route: {
      path: '/heatmap',
      component: loadable(() => import(/* webpackChunkName: 'heatmap' */ '../pages/heatmap')),
    },
  },
  {
    name: 'mapbin',
    key: 'mapbin',
    route: {
      path: '/mapbin',
      component: loadable(() => import(/* webpackChunkName: 'mapbin' */ '../pages/mapbin')),
    },
  },
  {
    name: 'weibo',
    key: 'weibo',
    route: {
      path: '/weibo',
      component: loadable(() => import(/* webpackChunkName: 'weibo' */ '../pages/weibo')),
    },
  },
  {
    name: 'wchartgl',
    key: 'wchartgl',
    route: {
      path: '/wchartgl',
      component: loadable(() => import(/* webpackChunkName: 'wchartgl' */ '../pages/wchartgl')),
    },
  },
  {
    name: 'wind',
    key: 'wind',
    route: {
      path: '/wind',
      component: loadable(() => import(/* webpackChunkName: 'wind' */ '../pages/flowgl')),
    },
  },
  {
    name: 'aireline',
    key: 'aireline',
    route: {
      path: '/aireline',
      component: loadable(() => import(/* webpackChunkName: 'aireline' */ '../pages/aireline')),
    },
  },
  {
    name: 'tourism',
    key: 'tourism',
    route: {
      path: '/tourism',
      component: loadable(() => import(/* webpackChunkName: 'tourism' */ '../pages/tourism')),
    },
  },
  {
    name: 'trackline',
    key: 'trackline',
    route: {
      path: '/trackline',
      component: loadable(() => import(/* webpackChunkName: 'trackline' */ '../pages/track-line')),
    },
  },
  {
    name: 'incremental',
    key: 'incremental',
    route: {
      path: '/incremental',
      component: loadable(() => import(/* webpackChunkName: 'incremental' */ '../pages/lines-ny')),
    },
  },
];

const routes = (
  <Switch>
    // @ts-ignore
    {mainRouter.map((route) => <Route key={route.key} {...route.route} />)}
    <Redirect to="/index" />
  </Switch>
);

export default routes;
