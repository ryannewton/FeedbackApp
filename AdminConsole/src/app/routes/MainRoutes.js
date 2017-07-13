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
      <Route exact path="/" component={Home} />
      <Route path="/general" component={General} />
      <Route path="/general/tabPanels" component={TabPanel} />

      <Route path="/approveFeedback" component={ApproveFeedback} />
      <Route path="/approveSolutions" component={ApproveSolutions} />
      <Route path="/authorizeUser" component={AuthorizeUser} />
      <Route path="/manageFeedback" component={ManageFeedback} />
      <Route path="/sendCode" component={SendCode} />
      <Route path="/signout" component={Signout} />

      <Route path="*" component={PageNotFound} />
    </Switch>
  );
};

export default MainRoutes;
