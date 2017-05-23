// Import Libraries
import React from 'react';
import { StackNavigator } from 'react-navigation';

// Import Tabs, Stacks, and Scenes
import NavTabs from './NavTabs';
import AuthStack from './AuthStack';
import SplashScreenStack from './SplashScreenStack';

const Router = StackNavigator({
  SplashScreen: { screen: SplashScreenStack },
  Auth: { screen: AuthStack },
  Tabs: { screen: NavTabs },
}, {
  mode: 'modal',
  headerMode: 'none',
});

export default Router;
