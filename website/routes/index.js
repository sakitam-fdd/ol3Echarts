import React from 'react'; // eslint-disable-line
import { Route, Switch, Redirect } from 'react-router-dom'; // eslint-disable-line
import Index from '../pages/index';
import scatter from '../pages/scatter';

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
  }
];

const routes = (
  <Switch>
    {mainRouter.map((route) => <Route key={route.key} {...route.route} />)}
    <Redirect to="/index" />
  </Switch>
);

export default routes;
