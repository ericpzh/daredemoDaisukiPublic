import React from 'react';
import { Header } from 'react-navigation';
import { View, Dimensions, Alert } from 'react-native';
import { Button as NBButton, Text as NBText } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { styles, fontsStyles, themeColor } from '../../../styles/App/Setting/settingScreenStyles.js';
import { logout, accountInit } from '../../../actions/userActions.js';
import { vtuberInit } from '../../../actions/vtuberActions.js';
import Carousel from '../../../assets/loginBackground.js';
import { setPrevScreen } from '../../../actions/globalActions.js';

const mapStateToProps = (state) => {
  const { user } = state
  return { user }
};

const mapDispatchToProps = dispatch => ({
  vtuberInit: () => dispatch(vtuberInit()),
  accountInit: () => dispatch(accountInit()),
  logout: () => dispatch(logout()),
  setPrevScreen: (input) => dispatch(setPrevScreen(input)),
});

class SettingScreen extends React.Component {
  componentDidMount(){
    if(willBlurSubscription){
      willBlurSubscription.remove();
    }
    let willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload => {
        this.props.setPrevScreen("SettingScreen");
      }
    );
  }
  signOut = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            setTimeout(()=>{
              this.props.accountInit();//init props.user
              this.props.vtuberInit();//init props.vtuber
              this.props.logout();//reset props.user
            },50)
            this.props.navigation.navigate("Auth");//to Auth
          }
        },
      ],
    );
  }
  render() {
    var {height, width} = Dimensions.get('window');
    return (
      <View style={styles(this.props.user.colorTheme).container}>
          <View style={[styles(this.props.user.colorTheme).placeholder,{height: 5*(height-Header.HEIGHT)/10 }]} >
            <Carousel width={width} opacity={0.5}/>
          </View>

          <View style={styles(this.props.user.colorTheme).content} >
            <NBButton bordered onPress={()=>this.props.navigation.navigate("ColorScreen")} style={styles(this.props.user.colorTheme).button}>
              <Icon name="md-color-palette" size={20} color={themeColor(this.props.user.colorTheme)}/>
              <NBText style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).text]}>Color Theme</NBText>
            </NBButton>
            <NBButton bordered onPress={()=>this.props.navigation.navigate("FontScreen")} style={styles(this.props.user.colorTheme).button}>
              <Icon name="md-paper" size={20} color={themeColor(this.props.user.colorTheme)}/>
              <NBText style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).text]}>Font</NBText>
            </NBButton>
            <NBButton danger bordered onPress={this.signOut} style={styles(this.props.user.colorTheme).redbutton}>
              <Icon name="md-log-out" color="red" size={20} />
              <NBText style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).redtext]}>Sign Out</NBText>
            </NBButton>
          </View>
      </View>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(SettingScreen);
