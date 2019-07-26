import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { styles, fontsStyles } from '../../styles/drawerContentComponentsStyles.js'

const mapStateToProps = (state) => {
  const { user } = state
  return { user }
};

class DrawerContentComponents extends Component {
  /*
    Customize drawer components
  */
  navigateToScreen = ( route ) =>(
  /*
    navigate to Home/...
  */
      () => {
      const navigateAction = NavigationActions.navigate({
          routeName: route
      });
      this.props.navigation.dispatch(navigateAction);
  })

  render() {
    return (
      <View style={styles(this.props.user.colorTheme).container}>
          <View style={styles(this.props.user.colorTheme).headerContainer}>
              <Icon name="md-contact" size={84} style={styles(this.props.user.colorTheme).headerIcon}/>
              <Text style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).headerText]}>{this.props.user.name}</Text>
          </View>
          <View style={styles(this.props.user.colorTheme).screenContainer}>
              <TouchableOpacity style={this.props.activeItemKey==="Home"?styles(this.props.user.colorTheme).screenStyleActive:styles(this.props.user.colorTheme).screenStyle} onPress={this.navigateToScreen('Home')}>
                  <Icon name="md-home"  style={styles(this.props.user.colorTheme).screenIconStyle}/>
                  <Text style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).screenTextStyle]}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={this.props.activeItemKey==="Account"?styles(this.props.user.colorTheme).screenStyleActive:styles(this.props.user.colorTheme).screenStyle} onPress={this.navigateToScreen('Account')}>
                  <Icon name="md-key"  style={styles(this.props.user.colorTheme).screenIconStyle}/>
                  <Text style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).screenTextStyle]}>Account</Text>
              </TouchableOpacity>
              <TouchableOpacity style={this.props.activeItemKey==="Subscriptions"?styles(this.props.user.colorTheme).screenStyleActive:styles(this.props.user.colorTheme).screenStyle} onPress={this.navigateToScreen('Subscriptions')}>
                  <Icon name="md-heart"  style={styles(this.props.user.colorTheme).screenIconStyle}/>
                  <Text style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).screenTextStyle]}>Subscriptions</Text>
              </TouchableOpacity>
              <TouchableOpacity style={this.props.activeItemKey==="Groups"?styles(this.props.user.colorTheme).screenStyleActive:styles(this.props.user.colorTheme).screenStyle} onPress={this.navigateToScreen('Groups')}>
                  <Icon name="md-people"  style={styles(this.props.user.colorTheme).screenIconStyle}/>
                  <Text style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).screenTextStyle]}>Groups</Text>
              </TouchableOpacity>
              <TouchableOpacity style={this.props.activeItemKey==="Report"?styles(this.props.user.colorTheme).screenStyleActive:styles(this.props.user.colorTheme).screenStyle} onPress={this.navigateToScreen('Report')}>
                  <Icon name="md-construct"  style={styles(this.props.user.colorTheme).screenIconStyle}/>
                  <Text style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).screenTextStyle]}>Database Suggestion</Text>
              </TouchableOpacity>
              <TouchableOpacity style={this.props.activeItemKey==="Setting"?styles(this.props.user.colorTheme).screenStyleActive:styles(this.props.user.colorTheme).screenStyle} onPress={this.navigateToScreen('Setting')}>
                  <Icon name="md-settings"  style={styles(this.props.user.colorTheme).screenIconStyle}/>
                  <Text style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).screenTextStyle]}>Setting</Text>
              </TouchableOpacity>
          </View>
      </View>
    )
  }
}

export default connect(mapStateToProps)(DrawerContentComponents);
