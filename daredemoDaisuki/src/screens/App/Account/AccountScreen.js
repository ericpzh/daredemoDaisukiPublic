import React from 'react';
import { Header } from 'react-navigation';
import { View, Dimensions } from 'react-native';
import { Button as NBButton, Text as NBText } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { styles, fontsStyles, themeColor } from '../../../styles/App/Account/accountScreenStyles.js';
import Carousel from '../../../assets/loginBackground.js';
import { setPrevScreen } from '../../../actions/globalActions.js';

const mapStateToProps = (state) => {
  const { user } = state
  return { user }
};

const mapDispatchToProps = dispatch => ({
  setPrevScreen: (input) => dispatch(setPrevScreen(input)),
});


class AccountScreen extends React.Component {
  componentDidMount(){
    if(willBlurSubscription){
      willBlurSubscription.remove();
    }
    let willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload => {
        this.props.setPrevScreen("AccountScreen");
      }
    );
  }
  render() {
    var {height, width} = Dimensions.get('window');
    return (
      <View style={styles(this.props.user.colorTheme).container}>
          <View style={[styles(this.props.user.colorTheme).placeholder,{ height: 6*(height-Header.HEIGHT)/10 }]} >
            <Carousel width={width} opacity={0.5}/>
          </View>

          <View style={styles(this.props.user.colorTheme).content} >
            <NBButton dark bordered onPress={()=>{this.props.navigation.navigate("ChangePasswordScreen")}} style={styles(this.props.user.colorTheme).button}>
              <Icon name="md-key" color={themeColor(this.props.user.colorTheme)} size={20}/>
              <NBText style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).text]}>Change Password</NBText>
            </NBButton>
            <NBButton dark bordered onPress={()=>{this.props.navigation.navigate("ManageAPIScreen")}} style={styles(this.props.user.colorTheme).button}>
              <Icon name="md-finger-print" color={themeColor(this.props.user.colorTheme)} size={20}/>
              <NBText style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).text]}>Manage API Keys</NBText>
            </NBButton>
          </View>
      </View>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(AccountScreen)
