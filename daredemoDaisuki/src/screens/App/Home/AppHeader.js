import React from 'react';
import { Text, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { store } from '../../../store/index.js';
import { styles, fontsStyles,  colors } from '../../../styles/App/Home/headerStyles.js';

export const AppHeaderBar = ({navigation, collapsible}) => {
  const { translateY, translateOpacity, translateProgress } = collapsible;
  console.log(navigation.state)
  return (
    <View style={styles(store.getState().user.colorTheme).container}>
      <TouchableOpacity onPress={()=>navigation.toggleDrawer()}>
        <Icon name="md-menu" size={24} style={styles(store.getState().user.colorTheme).icon} />
      </TouchableOpacity>
      <TouchableWithoutFeedback
        onPress={()=>{
          if (navigation.state.routes && navigation.state.routes[navigation.state.index] && navigation.state.routes[navigation.state.index].params && navigation.state.routes[navigation.state.index].params.headerOnPressCallback) {//if valid
            navigation.state.routes[navigation.state.index].params.headerOnPressCallback();
          }else if(navigation.state && navigation.state.params && navigation.state.params.headerOnPressCallback){
            navigation.state.params.headerOnPressCallback();
          }
        }}>
        <Text style={[styles(store.getState().user.colorTheme).text, fontsStyles(store.getState().user.font).uiheader]}>
        {
        (navigation.state.routes && navigation.state.routes[navigation.state.index] && navigation.state.routes[navigation.state.index].params && navigation.state.routes[navigation.state.index].params.group)
        ?
        navigation.state.routes[navigation.state.index].params.group
        :
        (
          navigation.state  && navigation.state.params && navigation.state.params.group
          ?
          navigation.state.params.group
          :
          "Daredemo Daisuki"
        )
        }</Text>
      </TouchableWithoutFeedback>
      <TouchableOpacity onPress={()=>{navigation.navigate('SearchScreen')}}>
        <Icon name="md-search" size={24} style={styles(store.getState().user.colorTheme).icon} />
      </TouchableOpacity>
    </View>
  );
}

export const collapsibleParams = {
  collapsibleComponent: AppHeaderBar,
  collapsibleBackgroundStyle: {
    height: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingBottom: 5,
  }
}
