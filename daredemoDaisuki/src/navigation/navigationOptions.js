import React from 'react';
import { View, TouchableOpacity, Text, TouchableWithoutFeedback } from 'react-native';
import { Header as NBHeader, Item as NBItem, Input as NBInput } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';

import { colorTheme } from '../styles/colorTheme.js';
import SearchNavigationHeader from './components/SearchNavigationHeader.js';
import { store } from '../store/index.js';
import { fonts } from '../styles/fonts.js';

export const TwitterScreenNavigationOptions = ({ navigation }) => ({
  /*
  Customize twitter tab
  */
  tabBarLabel: ({ focused }) => (
    <TouchableWithoutFeedback
      style={{width:"100%", height:"100%", paddingTop: 15, flex: 1,}}
      onPress={()=>{
        if(!focused){
          navigation.navigate('TwitterScreen');
        }else if(navigation.state && navigation.state.params && navigation.state.params.tabOnPressCallback){
          navigation.state.params.tabOnPressCallback();
        }
      }}>
    <Text style={{fontSize: 12, paddingBottom: 3, textAlign: 'center', color: focused?'#6495ED':'grey', ...fonts(store.getState().user.font).ui}}>Twitter</Text>
    </TouchableWithoutFeedback>
  ),
  tabBarIcon: ({ focused }) => (
    <TouchableWithoutFeedback
      style={{width:"100%", height:"100%", paddingTop: 15, flex: 1,}}
      onPress={()=>{
        if(!focused){
          navigation.navigate('TwitterScreen');
        }else if(navigation.state && navigation.state.params && navigation.state.params.tabOnPressCallback){
          navigation.state.params.tabOnPressCallback();
        }
      }}>
    <Icon name='logo-twitter' size={12} style={{fontSize: 20, color: focused?'#6495ED':'grey'}}/>
    </TouchableWithoutFeedback>
  ),
})

export const BiliScreenNavigationOptions = ({ navigation }) => ({
  /*
  Customize bilibili tab
  */
  tabBarLabel: ({ focused }) => (
    <TouchableWithoutFeedback
      style={{width:"100%", height:"100%", paddingTop: 15, flex: 1,}}
      onPress={()=>{
        if(!focused){
          navigation.navigate('BiliScreen');
        }else if(navigation.state && navigation.state.params && navigation.state.params.tabOnPressCallback){
          navigation.state.params.tabOnPressCallback();
        }
      }}>
    <Text style={{fontSize: 12, paddingBottom: 3, textAlign: 'center', color: focused?'pink':'grey', ...fonts(store.getState().user.font).ui}}>Bilibili</Text>
    </TouchableWithoutFeedback>
  ),
  tabBarIcon: ({ focused }) => (
    <TouchableWithoutFeedback
      style={{width:"100%", height:"100%", paddingTop: 15, flex: 1,}}
      onPress={()=>{
        if(!focused){
          navigation.navigate('BiliScreen');
        }else if(navigation.state && navigation.state.params && navigation.state.params.tabOnPressCallback){
          navigation.state.params.tabOnPressCallback();
        }
      }}>
    <Icon name="md-tv" size={12} style={{fontSize: 20, color: focused?'pink':'grey'}}/>
    </TouchableWithoutFeedback>
  ),
})

export const YoutubeScreenNavigationOptions = ({ navigation }) => ({
  /*
  Customize youtube tab
  */
  tabBarLabel: ({ focused }) => (
    <TouchableWithoutFeedback
      style={{width:"100%", height:"100%", paddingTop: 15, flex: 1,}}
      onPress={()=>{
        if(!focused){
          navigation.navigate('YoutubeScreen');
        }else if(navigation.state && navigation.state.params && navigation.state.params.tabOnPressCallback){
          navigation.state.params.tabOnPressCallback();
        }
      }}>
    <Text style={{fontSize: 12, paddingBottom: 3, textAlign: 'center', color: focused?'red':'grey', ...fonts(store.getState().user.font).ui}}>Youtube</Text>
    </TouchableWithoutFeedback>
  ),
  tabBarIcon: ({ focused }) => (
    <TouchableWithoutFeedback
      style={{width:"100%", height:"100%", paddingTop: 15, flex: 1,}}
      onPress={()=>{
        if(!focused){
          navigation.navigate('YoutubeScreen');
        }else if(navigation.state && navigation.state.params && navigation.state.params.tabOnPressCallback){
          navigation.state.params.tabOnPressCallback();
        }
      }}>
    <Icon name="logo-youtube" size={12} style={{fontSize: 20, color: focused?'red':'grey'}}/>
    </TouchableWithoutFeedback>
  ),
})

export const AuthNavigationOptions = ({navigation}) => ({
  /*
  Customize Auth header
  */
  header: null,
})

export const SearchNavigationOptions = ({navigation}) => ({
  /*
  Customize search header
  */
  headerLeft:(
    <TouchableOpacity onPress={()=>navigation.goBack()}>
      <View style={{paddingHorizontal: 15}}>
        <Icon name="md-arrow-round-back" size={24} style={{color:colorTheme[store.getState().user.colorTheme].textQuinary}} />
      </View>
    </TouchableOpacity>
  ),
  headerTitle: (
    <SearchNavigationHeader/>
  ),
  headerStyle: {
    backgroundColor: colorTheme[store.getState().user.colorTheme].themeColor,

  },
  headerTintColor: colorTheme[store.getState().user.colorTheme].areaPrimary,
})

export const AppNavigationOptions = ({navigation}) => ({
  /*
  Customize App header
  */
  headerTitle: (
    <TouchableOpacity
      style={{width:"100%", height:"100%", paddingTop: 15}}
      onPress={()=>{
        if (navigation.state.routes && navigation.state.routes[navigation.state.index] && navigation.state.routes[navigation.state.index].params && navigation.state.routes[navigation.state.index].params.headerOnPressCallback) {//if valid
          navigation.state.routes[navigation.state.index].params.headerOnPressCallback();
        }else if(navigation.state && navigation.state.params && navigation.state.params.headerOnPressCallback){
          navigation.state.params.headerOnPressCallback();
        }
      }}>
      <Text
      style={{
          flexGrow: 1,
          alignSelf:'center',
          fontSize: 18.5,
          color: colorTheme[store.getState().user.colorTheme].textQuinary,
         ...fonts(store.getState().user.font).uiheader
      }}
      >
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
    </TouchableOpacity>
  ),
  headerLeft:(
    <TouchableOpacity onPress={()=>navigation.toggleDrawer()}>
      <View style={{paddingHorizontal: 15}}>
        <Icon name="md-menu" size={24} style={{color:colorTheme[store.getState().user.colorTheme].textQuinary}} />
      </View>
    </TouchableOpacity>
  ),
  headerRight:(
    <TouchableOpacity onPress={()=>{navigation.navigate('SearchScreen')}}>
      <View style={{paddingHorizontal: 15}}>
        <Icon name="md-search" size={24} style={{color:colorTheme[store.getState().user.colorTheme].textQuinary}} />
      </View>
    </TouchableOpacity>
  ),
  headerStyle: {
    backgroundColor: colorTheme[store.getState().user.colorTheme].themeColor,
  },
  headerTintColor: colorTheme[store.getState().user.colorTheme].areaPrimary,
})

export const ReportScreenNavigationOptions = ({navigation}) => ({
  /*
  Customize App header
  */
  headerTitle: (
    <View
      style={{width:"100%", height:"100%", paddingTop: 15}}>
      <Text
      style={{
          flexGrow: 1,
          alignSelf:'center',
          fontSize: 18.5,
          color: colorTheme[store.getState().user.colorTheme].textQuinary,
          ...fonts(store.getState().user.font).uiheader
      }}
      >
      {"Database Suggestion"}</Text>
    </View>
  ),
  headerLeft:(
    <TouchableOpacity onPress={()=>navigation.navigate('ReportScreen')}>
      <View style={{paddingHorizontal: 15}}>
        <Icon name="md-arrow-round-back" size={24} style={{color:colorTheme[store.getState().user.colorTheme].textQuinary}} />
      </View>
    </TouchableOpacity>
  ),
  headerRight:(
    <TouchableOpacity onPress={()=>{navigation.navigate('SearchScreen')}}>
      <View style={{paddingHorizontal: 15}}>
        <Icon name="md-search" size={24} style={{color:colorTheme[store.getState().user.colorTheme].textQuinary}} />
      </View>
    </TouchableOpacity>
  ),
  headerStyle: {
    backgroundColor: colorTheme[store.getState().user.colorTheme].themeColor,
  },
  headerTintColor: colorTheme[store.getState().user.colorTheme].areaPrimary,
})

export const SettingScreenNavigationOptions = ({navigation}) => ({
  /*
  Customize App header
  */
  headerTitle: (
    <View
      style={{width:"100%", height:"100%", paddingTop: 15}}>
      <Text
      style={{
          flexGrow: 1,
          alignSelf:'center',
          fontSize: 18.5,
          color: colorTheme[store.getState().user.colorTheme].textQuinary,
          ...fonts(store.getState().user.font).uiheader
      }}
      >
      {"Setting"}</Text>
    </View>
  ),
  headerLeft:(
    <TouchableOpacity onPress={()=>navigation.navigate('SettingScreen')}>
      <View style={{paddingHorizontal: 15}}>
        <Icon name="md-arrow-round-back" size={24} style={{color:colorTheme[store.getState().user.colorTheme].textQuinary}} />
      </View>
    </TouchableOpacity>
  ),
  headerRight:(
    <TouchableOpacity onPress={()=>{navigation.navigate('SearchScreen')}}>
      <View style={{paddingHorizontal: 15}}>
        <Icon name="md-search" size={24} style={{color:colorTheme[store.getState().user.colorTheme].textQuinary}} />
      </View>
    </TouchableOpacity>
  ),
  headerStyle: {
    backgroundColor: colorTheme[store.getState().user.colorTheme].themeColor,
  },
  headerTintColor: colorTheme[store.getState().user.colorTheme].areaPrimary,
})

export const AccountScreenNavigationOptions = ({navigation}) => ({
  /*
  Customize App header
  */
  headerTitle: (
    <View
      style={{width:"100%", height:"100%", paddingTop: 15}}>
      <Text
      style={{
          flexGrow: 1,
          alignSelf:'center',
          fontSize: 18.5,
          color: colorTheme[store.getState().user.colorTheme].textQuinary,
          ...fonts(store.getState().user.font).uiheader
      }}
      >
      {"Account"}</Text>
    </View>
  ),
  headerLeft:(
    <TouchableOpacity onPress={()=>navigation.navigate('AccountScreen')}>
      <View style={{paddingHorizontal: 15}}>
        <Icon name="md-arrow-round-back" size={24} style={{color:colorTheme[store.getState().user.colorTheme].textQuinary}} />
      </View>
    </TouchableOpacity>
  ),
  headerRight:(
    <TouchableOpacity onPress={()=>{navigation.navigate('SearchScreen')}}>
      <View style={{paddingHorizontal: 15}}>
        <Icon name="md-search" size={24} style={{color:colorTheme[store.getState().user.colorTheme].textQuinary}} />
      </View>
    </TouchableOpacity>
  ),
  headerStyle: {
    backgroundColor: colorTheme[store.getState().user.colorTheme].themeColor,
  },
  headerTintColor: colorTheme[store.getState().user.colorTheme].areaPrimary,
})
