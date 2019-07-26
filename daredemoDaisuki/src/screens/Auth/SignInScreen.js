import React from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, ScrollView, Dimensions  } from 'react-native';
import { Item as NBItem, Input as NBInput, Button as NBButton, Text as NBText, Toast as NBToast } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { styles } from '../../styles/Auth/signInScreenStyles.js';
import { login } from '../../api/express.js';
import { loginBegin, loginSuccess, loginFailure } from '../../actions/userActions.js';
import Carousel from '../../assets/loginBackground.js';
import LoadingComponent from '../../assets/loading.js';

const mapStateToProps = (state) => {
  const { user } = state
  return { user }
};

const mapDispatchToProps = dispatch => ({
  loginBegin: () => dispatch(loginBegin()),
  loginSuccess: (input) => dispatch(loginSuccess(input)),
  loginFailure: () => dispatch(loginFailure()),
});

class SignInScreen extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      hidePassword: false,
      authName: "",
      authPassword: "",
    }
  }
  signIn = () => {
    if (this.state.authName === "" || this.state.authPassword === ""){
      NBToast.show({
        text: 'Please Fill In Both Username And Password',
        duration: 2000,
        type: "danger",
      })//show Toast
    }else{
      login(this.state.authName, this.state.authPassword, this.props.loginBegin,this.props.loginSuccess,this.props.loginFailure);//login api call
    }
  }
  componentDidUpdate(prevProps){
    if(prevProps.user.authLoading && !this.props.user.authLoading){//if done loading
      if(this.props.user.name !== ""){//if login success
        this.props.navigation.navigate("SplashScreen");//to splash
      }else{//login fail
        setTimeout(()=>{//allow redux change store
          if(this.props.user.name === ""){
            NBToast.show({
              text: 'Error, try again',
              buttonText: 'Okay',
              duration: 3000,
              type: "danger",
            })// show Toast
          }
        },50)
      }
    }
  }
  render() {
    var {height, width} = Dimensions.get('window');
    return (
      <KeyboardAvoidingView style={styles('black').keyboardAvoidingView} behavior="position" keyboardVerticalOffset = {0}>
        <ScrollView style={styles('black').scrollView} >
          <View style={[styles('black').placeholder,{ height: 4.5*height/10 }]} >
            <Carousel width={width} opacity={0.1} />
          </View>

          <View style={[styles('black').content,{ height: 5.5*height/10 }]} >
            <NBItem>
              <Icon style={styles('black').icon} name='md-person' size={20} color="black"/>
              <NBInput style={styles('black').input} placeholder='Username' value={this.state.authName} onChangeText={(value: string)=>{this.setState({authName:value})}} onSubmitEditing={this.signIn}/>
            </NBItem>

            <NBItem>
              <Icon style={styles('black').icon} name='md-key' size={20} color="black"/>
              <NBInput style={styles('black').input} placeholder='Password' value={this.state.authPassword} onChangeText={(value: string)=>{this.setState({authPassword:value})}}  secureTextEntry={this.state.hidePassword} onSubmitEditing={this.signIn}/>
              <TouchableOpacity onPress={() => this.setState({hidePassword:!this.state.hidePassword})}>
                <Icon style={styles('black').icon} name={this.state.hidePassword?'md-eye':'md-eye-off'} size={20} color="black"/>
              </TouchableOpacity>
            </NBItem>

            <View style={styles('black').divider}/>

            <NBButton full dark onPress={this.signIn}>
              { this.props.user.authLoading
                ?
                <LoadingComponent duration={1000}/>
                :
                <NBText>Sign In</NBText>
              }
            </NBButton>

            <View style={styles('black').divider}/>

            <TouchableOpacity onPress={() => {this.props.navigation.navigate("SignUp")}} style={styles('black').textButton}>
              <NBText style={styles('black').textButtonText}>Don't have an account?</NBText>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(SignInScreen);
