import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { Root, Toast } from 'native-base';
import { PersistGate } from 'redux-persist/integration/react';
import * as Font from 'expo-font'
import { setExpoStatusBarHeight } from 'react-navigation-collapsible';
import Constants from 'expo-constants';

import { store } from './src/store/index.js';
import { persistor } from './src/store/index.js';
import AppContainer from './src/navigation/navigator.js';

setExpoStatusBarHeight(Constants.statusBarHeight);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  async componentWillMount() {
    await Font.loadAsync({
      ui: require('./src/assets/fonts/Amaranth-Regular.ttf'),
      uih: require('./src/assets/fonts/Amaranth-Bold.ttf'),
      jp: require('./src/assets/fonts/MPLUSRounded1c-Regular.ttf'),
      jpsh: require('./src/assets/fonts/MPLUSRounded1c-Medium.ttf'),
      jph: require('./src/assets/fonts/MPLUSRounded1c-Bold.ttf'),
      sc: require('./src/assets/fonts/ZCOOLXiaoWei-Regular.ttf'),
      scsh: require('./src/assets/fonts/ZCOOLKuaiLe-Regular.ttf'),
      sch: require('./src/assets/fonts/ZCOOLKuaiLe-Regular.ttf'),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading: false });
  }
  componentWillUnmount() {
    Toast.toastInstance = null;
  }
  render() {
    if (this.state.loading) {
      return (<View/>);
    }
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Root>
            <AppContainer/>
          </Root>
        </PersistGate>
      </Provider>
    );
  }
}
