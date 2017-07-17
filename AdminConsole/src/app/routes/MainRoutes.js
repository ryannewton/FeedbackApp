/* eslint no-process-env:0 */
import React from 'react';
import {
 Route,
 Switch,
} from 'react-router';
import {
  Login,
  Logout,

  ApproveFeedback,
  ManageFeedback,
  Dashboard,

  PageNotFound,
} from '../containers';

export const MainRoutes = () =>
  (
    <Switch>
      {/* Home */}
      <Route exact path="/admin/" component={Dashboard} />

      {/* Auth */}
      <Route path="/admin/login" component={Dashboard} />
      <Route path="/admin/logout" component={Logout} />

      {/* Main */}
      <Route path="/admin/approve" component={ApproveFeedback} />
      <Route path="/admin/edit" component={ManageFeedback} />
      <Route path="/admin/dashboard" component={Dashboard} />

      {/* All other */}
      <Route path="*" component={PageNotFound} />
    </Switch>
  );

export default MainRoutes;
