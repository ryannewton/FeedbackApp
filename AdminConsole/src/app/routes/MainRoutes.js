/* eslint no-process-env:0 */
import React from 'react';
import {
 Route,
 Switch,
 // Router,
} from 'react-router';
import {
  App,
  General,
  Home,
  PageNotFound,
  TabPanel,

  ApproveFeedback,
  ApproveSolutions,
  AuthorizeUser,
  ManageFeedback,
  SendCode,
  Signout,
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

      {/*Manage*/}
      <Route path="/admin/approveFeedback" component={ApproveFeedback} />
      <Route path="/admin/approveSolutions" component={ApproveSolutions} />
      <Route path="/admin/edit" component={ApproveSolutions} />
      

      {/*Insights*/}
      <Route path="/admin/keystats" component={ManageFeedback} />
      <Route path="/admin/dashboard" component={ManageFeedback} />
      <Route path="/admin/respond" component={ManageFeedback} />
      <Route path="/admin/focusgroup" component={ManageFeedback} />

      {/*All other*/}
      <Route path="*" component={PageNotFound} />
    </Switch>
  );
};

export default MainRoutes;
