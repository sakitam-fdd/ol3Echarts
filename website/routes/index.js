import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
// import bar from '../pages/bar';
// import pie from '../pages/pie';
import Index from '../pages/index';
// import lineBus from '../pages/lineBus';
import scatter from '../pages/scatter';
// import migration from '../pages/migration';
// import traffic from '../pages/traffic';
// import chinaMigration from '../pages/chinaMigration';
// import heatmap from '../pages/heatmap';
// import mapbin from '../pages/mapbin';
// import weibo from '../pages/weibo';
// import wchartgl from '../pages/wchartgl';
// import wind from '../pages/flowgl';
// import aireline from '../pages/aireline';
// import tourism from '../pages/tourism';
// import trackline from '../pages/track-line';
// import incremental from '../pages/lines-ny';

const mainRouter = [
  {
    name: 'index',
    key: 'index',
    route: {
      path: '/index',
      component: Index,
    },
  },
  {
    name: 'scatter',
    key: 'scatter',
    route: {
      path: '/scatter',
      component: scatter,
    },
  },
  // {
  //   name: 'migration',
  //   key: 'migration',
  //   route: {
  //     path: '/migration',
  //     component: migration,
  //   },
  // },
  // {
  //   name: 'lineBus',
  //   key: 'lineBus',
  //   route: {
  //     path: '/lineBus',
  //     component: lineBus,
  //   },
  // },
  // {
  //   name: 'traffic',
  //   key: 'traffic',
  //   route: {
  //     path: '/traffic',
  //     component: traffic,
  //   },
  // },
  // {
  //   name: 'chinaMigration',
  //   key: 'chinaMigration',
  //   route: {
  //     path: '/chinaMigration',
  //     component: chinaMigration,
  //   },
  // },
  // {
  //   name: 'bar',
  //   key: 'bar',
  //   route: {
  //     path: '/bar',
  //     component: bar,
  //   },
  // },
  // {
  //   name: 'pie',
  //   key: 'pie',
  //   route: {
  //     path: '/pie',
  //     component: pie,
  //   },
  // },
  // {
  //   name: 'heatmap',
  //   key: 'heatmap',
  //   route: {
  //     path: '/heatmap',
  //     component: heatmap,
  //   },
  // },
  // {
  //   name: 'mapbin',
  //   key: 'mapbin',
  //   route: {
  //     path: '/mapbin',
  //     component: mapbin,
  //   },
  // },
  // {
  //   name: 'weibo',
  //   key: 'weibo',
  //   route: {
  //     path: '/weibo',
  //     component: weibo,
  //   },
  // },
  // {
  //   name: 'wchartgl',
  //   key: 'wchartgl',
  //   route: {
  //     path: '/wchartgl',
  //     component: wchartgl,
  //   },
  // },
  // {
  //   name: 'wind',
  //   key: 'wind',
  //   route: {
  //     path: '/wind',
  //     component: wind,
  //   },
  // },
  // {
  //   name: 'aireline',
  //   key: 'aireline',
  //   route: {
  //     path: '/aireline',
  //     component: aireline,
  //   },
  // },
  // {
  //   name: 'tourism',
  //   key: 'tourism',
  //   route: {
  //     path: '/tourism',
  //     component: tourism,
  //   },
  // },
  // {
  //   name: 'trackline',
  //   key: 'trackline',
  //   route: {
  //     path: '/trackline',
  //     component: trackline,
  //   },
  // },
  // {
  //   name: 'incremental',
  //   key: 'incremental',
  //   route: {
  //     path: '/incremental',
  //     component: incremental,
  //   },
  // },
];

const routes = (
  <Switch>
    {mainRouter.map((route) => <Route key={route.key} {...route.route} />)}
    <Redirect to="/index" />
  </Switch>
);

export default routes;
