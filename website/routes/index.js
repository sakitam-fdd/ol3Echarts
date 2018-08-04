import React from 'react'; // eslint-disable-line
import { Route, Switch, Redirect } from 'react-router-dom'; // eslint-disable-line
import bar from '../pages/bar';
import pie from '../pages/pie';
import Index from '../pages/index';
import lineBus from '../pages/lineBus';
import scatter from '../pages/scatter';
import migration from '../pages/migration';
import traffic from '../pages/traffic';
import chinaMigration from '../pages/chinaMigration';

const mainRouter = [
  {
    name: 'index',
    key: 'index',
    route: {
      path: '/index',
      component: Index
    }
  },
  {
    name: 'scatter',
    key: 'scatter',
    route: {
      path: '/scatter',
      component: scatter
    }
  },
  {
    name: 'migration',
    key: 'migration',
    route: {
      path: '/migration',
      component: migration
    }
  },
  {
    name: 'lineBus',
    key: 'lineBus',
    route: {
      path: '/lineBus',
      component: lineBus
    }
  },
  {
    name: 'traffic',
    key: 'traffic',
    route: {
      path: '/traffic',
      component: traffic
    }
  },
  {
    name: 'chinaMigration',
    key: 'chinaMigration',
    route: {
      path: '/chinaMigration',
      component: chinaMigration
    }
  },
  {
    name: 'bar',
    key: 'bar',
    route: {
      path: '/bar',
      component: bar
    }
  },
  {
    name: 'pie',
    key: 'pie',
    route: {
      path: '/pie',
      component: pie
    }
  }
];

const routes = (
  <Switch>
    {mainRouter.map((route) => <Route key={route.key} {...route.route} />)}
    <Redirect to="./index" />
  </Switch>
);

export default routes;
