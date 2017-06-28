// Import Libraries
import React from 'react';
import { StackNavigator } from 'react-navigation';

// Import Tabs, Stacks, and Scenes
import NavTabs from './NavTabs';
import AuthStack from './AuthStack';
import SplashScreenStack from './SplashScreenStack';
import WelcomeScreen from '../scenes/Welcome';

const stack = {
  SplashScreen: { screen: SplashScreenStack },
  Welcome: { screen: WelcomeScreen },
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
