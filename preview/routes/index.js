import React from 'react'; // eslint-disable-line
import { Route, Switch, Redirect } from 'react-router-dom'; // eslint-disable-line
import scatter from '../pages/scatter';

const mainRouter = [
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
    <Redirect to="/map" />
  </Switch>
);

export default routes;
