/* eslint no-process-env:0 */
import React from 'react';
import {
 Route,
 Switch,
} from 'react-router';
import {
  Logout,

  Dashboard,
  Approve,
  Edit,

  PageNotFound,
} from '../containers';

export const MainRoutes = () =>
  (
    <Switch>
      {/* Home */}
      <Route exact path="/web" component={Dashboard} />

      {/* Auth */}
      <Route path="/login" component={Dashboard} />
      <Route path="/logout" component={Logout} />

      {/* Main */}
      <Route path="/dashboard" component={Dashboard} />

      {/* All other */}
      <Route path="*" component={PageNotFound} />
    </Switch>
  );

export default MainRoutes;
