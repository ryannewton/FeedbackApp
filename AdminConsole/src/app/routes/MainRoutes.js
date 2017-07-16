/* eslint no-process-env:0 */
import React from 'react';
import {
 Route,
 Switch,
} from 'react-router';
import {
  Home,
  SendCode,
  AuthorizeUser,
  Signout,
  ApproveFeedback,
  ApproveSolutions,
  ManageFeedback,
  Dashboard,
  PageNotFound,
} from '../containers';

export const MainRoutes = () => {
  return (
    <Switch>
      {/*Home*/}
      <Route exact path="/admin/" component={Home} />

      {/*Auth*/}
      <Route path="/admin/sendCode" component={SendCode} />
      <Route path="/admin/authorize" component={AuthorizeUser} />
      <Route path="/admin/signout" component={Signout} />

      {/*Main*/}
      <Route path="/admin/approve" component={ApproveFeedback} />
      <Route path="/admin/edit" component={ApproveSolutions} />
      <Route path="/admin/dashboard" component={Dashboard} />

      {/*All other*/}
      <Route path="*" component={PageNotFound} />
    </Switch>
  );
};

export default MainRoutes;
