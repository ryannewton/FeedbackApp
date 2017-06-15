// Import Libraries
import React from 'react';
import { StackNavigator } from 'react-navigation';

// Import Tabs, Stacks, and Scenes
import NavTabs from './NavTabs';
import AuthStack from './AuthStack';
import SplashScreenStack from './SplashScreenStack';

const stack = {
  SplashScreen: { screen: SplashScreenStack },
  Auth: { screen: AuthStack },
  Tabs: { screen: NavTabs },
};

const options = {
  mode: 'modal',
  headerMode: 'none',
  navigationOptions: { gesturesEnabled: false },
};

const Router = StackNavigator(stack, options);

export default Router;
