import React from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, ScrollView, Dimensions, Image  } from 'react-native';
import { Header } from 'react-navigation';
import { Item as NBItem, Button as NBButton, Input as NBInput, Text as NBText, Toast as NBToast } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { styles, fontsStyles } from '../../../styles/App/Account/changePasswordScreenStyles.js';
import { putPassword } from '../../../api/express.js';
import { changePasswordBegin, changePasswordSuccess, changePasswordFailure } from '../../../actions/userActions.js';
import LoadingComponent from '../../../assets/loading.js';
import Carousel from '../../../assets/loginBackground.js';


const mapStateToProps = (state) => {
  const { user } = state
  return { user }
};

const mapDispatchToProps = dispatch => ({
  changePasswordBegin: () => dispatch(changePasswordBegin()),
  changePasswordSuccess: (input) => dispatch(changePasswordSuccess(input)),
  changePasswordFailure: () => dispatch(changePasswordFailure()),
});
class ChangePasswordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hidePassword: false,
      authPassword: "",
      authNewPassword: "",
    }
  }
  changePassword = () => {
    if(this.state.authPassword !== "" && this.state.authNewPassword !== ""){
      putPassword(this.props.user.name, this.state.authPassword, this.state.authNewPassword , this.props.changePasswordBegin,this.props.changePasswordSuccess,this.props.changePasswordFailure);//call change password api
    }else{
      NBToast.show({
        text: 'Please Fill In Both Old And New Password',
        duration: 1000,
        type: "danger",
      })//show Toast
    }
  }
  componentDidUpdate(prevProps){
    if(prevProps.user.authLoading && !this.props.user.authLoading){//if done loading
      if(prevProps.user.password !== this.props.user.password){//if change password success
        NBToast.show({
          text: 'Success',
          buttonText: 'Okay',
          duration: 3000,
          type: "success",
        })//show Toast
      }else{//change password failure
        NBToast.show({
          text: 'Error, try again',
          buttonText: 'Okay',
          duration: 3000,
          type: "danger",
        })//show Toast
      }
    }
  }
  render() {
    var {height, width} = Dimensions.get('window');
    return (
      <KeyboardAvoidingView style={styles(this.props.user.colorTheme).keyboardAvoidingView} behavior="position" keyboardVerticalOffset = {0}>
        <ScrollView style={styles(this.props.user.colorTheme).scrollView} >
          <View style={[styles(this.props.user.colorTheme).placeholder,{ height: 4*(height-Header.HEIGHT-80)/10 }]} >
            <Carousel width={width} opacity={0.5} appBackground={true}/>
          </View>

          <View style={[styles(this.props.user.colorTheme).content,{ height: 6*(height-Header.HEIGHT-80)/10 }]} >
            <NBItem>
              <Icon style={styles(this.props.user.colorTheme).icon} name='md-key' size={20}/>
              <NBInput placeholder='Old Password' value={this.state.authPassword} style={fontsStyles(this.props.user.font).ui} onChangeText={(value: string)=>{this.setState({authPassword:value})}} secureTextEntry={this.state.hidePassword}/>
              <TouchableOpacity onPress={()=>this.setState({hidePassword:!this.state.hidePassword})}>
                <Icon style={styles(this.props.user.colorTheme).icon} name={this.state.hidePassword?'md-eye':'md-eye-off'} size={20}/>
              </TouchableOpacity>
            </NBItem>

            <NBItem last>
              <Icon style={styles(this.props.user.colorTheme).icon} name='md-key' size={20}/>
              <NBInput placeholder='New Password' value={this.state.authNewPassword} style={fontsStyles(this.props.user.font).ui} onChangeText={(value: string)=>{this.setState({authNewPassword:value})}} secureTextEntry={this.state.hidePassword}/>
              <TouchableOpacity onPress={()=>this.setState({hidePassword:!this.state.hidePassword})}>
                <Icon style={styles(this.props.user.colorTheme).icon} name={this.state.hidePassword?'md-eye':'md-eye-off'} size={20}/>
              </TouchableOpacity>
            </NBItem>

            <NBButton full dark onPress={this.changePassword}>
              { this.props.user.authLoading
                ?
                <LoadingComponent duration={1000}/>
                :
                <NBText style={fontsStyles(this.props.user.font).ui}>Change Password</NBText>
              }
            </NBButton>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ChangePasswordScreen);
