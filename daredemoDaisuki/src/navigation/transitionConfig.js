import { fromBottom, fromTop, fromLeft } from 'react-navigation-transitions';

export const handleAuthTransition = ({ scenes }) => {
  /*
  Create custom transition
  */
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];
  if (prevScene
    && prevScene.route.routeName === 'Welcome'
    && (nextScene.route.routeName === 'SignIn' || nextScene.route.routeName === 'SignUp')) {
    return fromBottom();
  } else if (prevScene
    && (prevScene.route.routeName === 'SignIn' || prevScene.route.routeName === 'SignUp')
    && nextScene.route.routeName === 'Welcome') {
    return fromTop();
  }else if (prevScene
    && ((prevScene.route.routeName === 'SignIn' && nextScene.route.routeName === 'SignUp')
    || (prevScene.route.routeName === 'SignUp' && nextScene.route.routeName === 'SignIn'))) {
    return fromLeft();
  }
  return fromBottom();
}

export const handleAccountTransition = ({ scenes }) => {
  /*
  Create custom transition
  */
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];
  if (prevScene
    && prevScene.route.routeName === 'AccountScreen'
    && (nextScene.route.routeName === 'ChangePasswordScreen' || nextScene.route.routeName === 'ManageAPIScreen')) {
    return fromBottom();
  } else if (prevScene
    && (prevScene.route.routeName === 'ChangePasswordScreen' || prevScene.route.routeName === 'ManageAPIScreen')
    && nextScene.route.routeName === 'AccountScreen') {
    return fromTop();
  }else if (prevScene
    && ((prevScene.route.routeName === 'ChangePasswordScreen' && nextScene.route.routeName === 'ManageAPIScreen')
    || (prevScene.route.routeName === 'ManageAPIScreen' && nextScene.route.routeName === 'ChangePasswordScreen'))) {
    return fromLeft();
  }
  return fromBottom();
}

export const handleSettingTransition = ({ scenes }) => {
  /*
  Create custom transition
  */
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];
  if (prevScene
    && prevScene.route.routeName === 'SettingScreen'
    && (nextScene.route.routeName === 'ColorScreen' )) {
    return fromBottom();
  } else if (prevScene
    && (prevScene.route.routeName === 'ColorScreen' )
    && nextScene.route.routeName === 'SettingScreen') {
    return fromTop();
  }
  return fromBottom();
}

export const handleReportTransition = ({ scenes }) => {
  /*
  Create custom transition
  */
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];
  if (prevScene
    && prevScene.route.routeName === 'ReportScreen'
    && (nextScene.route.routeName === 'ModifyTagsScreen' || nextScene.route.routeName === 'ModifyVtuberScreen' || nextScene.route.routeName === 'NewVtuberScreen' )) {
    return fromBottom();
  } else if (prevScene
    && (prevScene.route.routeName === 'ModifyTagsScreen' || prevScene.route.routeName === 'ModifyVtuberScreen' || prevScene.route.routeName === 'NewVtuberScreen')
    && nextScene.route.routeName === 'ReportScreen') {
    return fromTop();
  } else if (prevScene
    && (prevScene.route.routeName === 'ModifyTagsScreen' || prevScene.route.routeName === 'ModifyVtuberScreen' || prevScene.route.routeName === 'NewVtuberScreen')
    && (nextScene.route.routeName === 'ModifyTagsScreen' || nextScene.route.routeName === 'ModifyVtuberScreen' || nextScene.route.routeName === 'NewVtuberScreen' )) {
    return fromLeft();
  }
  return fromBottom();
}
