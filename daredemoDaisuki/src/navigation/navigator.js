import React from 'react';
import { Text } from 'react-native';
import { createAppContainer, createSwitchNavigator, createDrawerNavigator, createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import SplashScreen from '../screens/SplashScreen.js';

import SignInScreen from '../screens/Auth/SignInScreen.js';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import WelcomeScreen from '../screens/Auth/WelcomeScreen';

import SearchScreen from '../screens/App/SearchScreen.js';

import AccountScreen from '../screens/App/Account/AccountScreen.js';
import ChangePasswordScreen from '../screens/App/Account/ChangePasswordScreen.js';
import ManageAPIScreen from '../screens/App/Account/ManageAPIScreen.js';

import SubscriptionsScreen from '../screens/App/Subscriptions/SubscriptionsScreen.js';

import ManageGroupScreen from '../screens/App/Groups/ManageGroupScreen.js';

import SettingScreen from '../screens/App/Setting/SettingScreen.js';
import ColorScreen from '../screens/App/Setting/ColorScreen.js';
import FontScreen from '../screens/App/Setting/FontScreen.js';

import YoutubeScreen from '../screens/App/Home/YoutubeScreen.js';
import TwitterScreen from '../screens/App/Home/TwitterScreen.js';
import BiliScreen from '../screens/App/Home/BiliScreen.js';

import ReportScreen from '../screens/App/Report/ReportScreen.js'
import ModifyVtuberScreen from '../screens/App/Report/ModifyVtuberScreen.js'
import NewVtuberScreen from '../screens/App/Report/NewVtuberScreen.js'
import ModifyTagsScreen from '../screens/App/Report/ModifyTagsScreen.js'

import DrawerContentComponents from './components/DrawerContentComponents.js'

import { AppNavigationOptions, SearchNavigationOptions, AuthNavigationOptions, YoutubeScreenNavigationOptions, BiliScreenNavigationOptions, TwitterScreenNavigationOptions, ReportScreenNavigationOptions, SettingScreenNavigationOptions, AccountScreenNavigationOptions } from './navigationOptions.js';

import { handleAuthTransition, handleAccountTransition, handleSettingTransition, handleReportTransition } from './transitionConfig.js';
/*
.1 AppContainer
..2 AppSwitchNavigator [default]
...3 SplashScreen [default]
...3 AuthStackNavigator
....4 Welcome [default]
....4 Signin
....4 Signup
...3 AppDrawerNavigator
....4 AppStackNavigator [default]
.....5 AppTabNavigator [default]
......6 YoutubeScreen
......6 BiliScreen [default]
......6 TwitterScreen
.....5 SearchScreen
....4 AccountStackNavigator
.....5 AccountScreen [default]
.....5 ChangePasswordScreen
.....5 ManageAPIScreen
....4 SubscriptionsStackNavigator
.....5 SubscriptionsScreen [default]
....4 GroupsStackNavigator
.....5 ManageGroupScreen [default]
....4 SettingStackNavigator
.....5 SettingScreen [default]
.....5 ColorScreen
.....5 FontScreen
....4 ReportStackNavigator
.....5 ReportScreen [default]
.....5 ModifyTagsScreen
.....5 ModifyVtuberScreen
.....5 NewVtuberScreen
*/

//TODO Add top Modal Screen
const AppTabNavigator = createBottomTabNavigator({
  YoutubeScreen:{
      screen: YoutubeScreen,
      navigationOptions: YoutubeScreenNavigationOptions
  },
  BiliScreen: {
      screen: BiliScreen,
      navigationOptions: BiliScreenNavigationOptions
  },
  TwitterScreen: {
      screen: TwitterScreen,
      navigationOptions: TwitterScreenNavigationOptions
    }
},
{
  initialRouteName: "BiliScreen"
})

const AppStackNavigator = createStackNavigator({
    AppTabNavigator:{
      screen: AppTabNavigator,
      navigationOptions: {
        header: null
      }
    },
    SearchScreen: {
      screen: SearchScreen,
      navigationOptions: SearchNavigationOptions
    }
})

const AccountStackNavigator = createStackNavigator({
  AccountScreen: {
    screen: AccountScreen,
    navigationOptions: AppNavigationOptions
  },
  ChangePasswordScreen: {
    screen: ChangePasswordScreen,
    navigationOptions: AccountScreenNavigationOptions
  },
  ManageAPIScreen: {
    screen: ManageAPIScreen,
    navigationOptions: AccountScreenNavigationOptions
  }
},{
  transitionConfig: (nav) => handleAccountTransition(nav)
})

const SubscriptionsStackNavigator = createStackNavigator({
  SubscriptionsScreen: {
    screen: SubscriptionsScreen,
    navigationOptions: AppNavigationOptions
  }
})

const GroupsStackNavigator = createStackNavigator({
  ManageGroupScreen: {
    screen: ManageGroupScreen,
    navigationOptions: AppNavigationOptions
  }
})

const SettingStackNavigator = createStackNavigator({
  SettingScreen: {
    screen: SettingScreen,
    navigationOptions: AppNavigationOptions
  },
  ColorScreen: {
    screen: ColorScreen,
    navigationOptions: SettingScreenNavigationOptions,
  },
  FontScreen: {
    screen: FontScreen,
    navigationOptions: SettingScreenNavigationOptions,
  }
},
{
  transitionConfig: (nav) => handleSettingTransition(nav)
})

const ReportStackNavigator = createStackNavigator({
  ReportScreen: {
    screen: ReportScreen,
    navigationOptions: AppNavigationOptions
  },
  ModifyTagsScreen: {
    screen: ModifyTagsScreen,
    navigationOptions: ReportScreenNavigationOptions
  },
  ModifyVtuberScreen: {
    screen: ModifyVtuberScreen,
    navigationOptions: ReportScreenNavigationOptions
  },
  NewVtuberScreen: {
    screen: NewVtuberScreen,
    navigationOptions: ReportScreenNavigationOptions
  }
},
{
  transitionConfig: (nav) => handleReportTransition(nav)
})

const AppDrawerNavigator = createDrawerNavigator({
  Home: AppStackNavigator,
  Account: AccountStackNavigator,
  Subscriptions: SubscriptionsStackNavigator,
  Groups: GroupsStackNavigator,
  Setting: SettingStackNavigator,
  Report: ReportStackNavigator,
},
{
   contentComponent: DrawerContentComponents,
   drawerWidth: 280,//drawer width
})

const AuthStackNavigator = createStackNavigator({
  Welcome: {
    screen: WelcomeScreen,
    navigationOptions: AuthNavigationOptions,
    },
  SignIn: {
    screen: SignInScreen,
    navigationOptions: AuthNavigationOptions,
    },
  SignUp: {
    screen: SignUpScreen,
    navigationOptions: AuthNavigationOptions,
    },
  },
  {
    transitionConfig: (nav) => handleAuthTransition(nav)
  })

const AppSwitchNavigator = createSwitchNavigator({
  SplashScreen: {
    screen: SplashScreen
  },
  Auth: {
    screen: AuthStackNavigator,
    navigationOptions: AuthNavigationOptions,
  },
  App: {
    screen: AppDrawerNavigator,
    navigationOptions: AuthNavigationOptions,
  },
})

const AppContainer = createAppContainer(AppSwitchNavigator)

export default AppContainer
