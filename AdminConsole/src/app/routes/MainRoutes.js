/* eslint no-process-env:0 */
import React from 'react';
import {
 Route,
 Switch
} from 'react-router';
import {
  App,
  General,
  Home,
  PageNotFound,
  TabPanel,
} from '../containers';

export const MainRoutes = () => {
  return (
    <Switch>
      <Route exact component={Home} />
      <Route path="/general" component={General} />
      <Route path="/general/tabPanels" component={TabPanel} />

      <Route path="*" component={PageNotFound} />
    </Switch>
  );
};

export default MainRoutes;
