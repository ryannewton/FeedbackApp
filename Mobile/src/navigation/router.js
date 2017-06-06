// Import Libraries
import React from 'react';
import { StackNavigator } from 'react-navigation';

// Import Tabs, Stacks, and Scenes
import NavTabs from './NavTabs';
import AuthStack from './AuthStack';
import SplashScreenStack from './SplashScreenStack';

const tabs = {
  SplashScreen: { screen: SplashScreenStack },
  Auth: { screen: AuthStack },
  Tabs: { screen: NavTabs },
};

const options = {
  mode: 'modal',
  headerMode: 'none',
};

const Router = StackNavigator(tabs, options);

export default Router;
