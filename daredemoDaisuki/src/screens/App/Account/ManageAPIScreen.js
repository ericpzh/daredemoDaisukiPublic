import React from 'react';
import { Header } from 'react-navigation';
import { View, TouchableOpacity, KeyboardAvoidingView, ScrollView, Linking, Text, Modal } from 'react-native';
import { Item as NBItem, Input as NBInput, Button as NBButton, Text as NBText, Toast as NBToast } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { styles, fontsStyles } from '../../../styles/App/Account/manageAPIScreenStyles.js';
import { putGoogleapikey, putTwitterapikey } from '../../../api/express.js';
import { putTwitterAPIKeyBegin, putTwitterAPIKeySuccess, putTwitterAPIKeyFailure, putGoogleAPIKeyBegin, putGoogleAPIKeySuccess, putGoogleAPIKeyFailure } from '../../../actions/userActions.js';
import LoadingComponent from '../../../assets/loading.js';

const mapStateToProps = (state) => {
  const { user } = state
  return { user }
};

const mapDispatchToProps = dispatch => ({
  putTwitterAPIKeyBegin: () => dispatch(putTwitterAPIKeyBegin()),
  putTwitterAPIKeySuccess: (input) => dispatch(putTwitterAPIKeySuccess(input)),
  putTwitterAPIKeyFailure: () => dispatch(putTwitterAPIKeyFailure()),
  putGoogleAPIKeyBegin: () => dispatch(putGoogleAPIKeyBegin()),
  putGoogleAPIKeySuccess: (input) => dispatch(putGoogleAPIKeySuccess(input)),
  putGoogleAPIKeyFailure: () => dispatch(putGoogleAPIKeyFailure()),
});

class ManageAPIScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      googleApiKey : "",
      twitterApiKey: {key:"",secretKey:"",token:"",secretToken:""},
    }
  }
  render() {
    return (
      <KeyboardAvoidingView style={styles(this.props.user.colorTheme).keyboardAvoidingView} behavior="padding" keyboardVerticalOffset = {80}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.props.user.authLoading}
          onRequestClose={() => {
          }}>
          <View style={styles(this.props.user.colorTheme).modalContainer}><LoadingComponent duration={1000}/></View>
        </Modal>
        <ScrollView style={styles(this.props.user.colorTheme).container} >
            <View style={styles(this.props.user.colorTheme).smallDivider}/>

            <Text style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).apikeys]}> Current Google API Key: {this.props.user.googleapikey===""?"None":this.props.user.googleapikey} </Text>
            <NBItem>
              <Icon style={styles(this.props.user.colorTheme).icon} name='logo-youtube' size={20}/>
              <NBInput placeholder='Google API Key' value={this.state.googleApiKey} style={fontsStyles(this.props.user.font).ui} onChangeText={(value: string)=>{this.setState({googleApiKey:value})}}/>
              <TouchableOpacity onPress={()=>{
                //how to get google api key?
                Linking.openURL('https://www.slickremix.com/docs/get-api-key-for-youtube/');
              }}>
                <Icon style={styles(this.props.user.colorTheme).icon} name="md-help-circle-outline" size={20}/>
              </TouchableOpacity>
            </NBItem>

            <View style={styles(this.props.user.colorTheme).smallDivider}/>

            <Text style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).apikeys]}> Current Twitter API Key: {this.props.user.twitterapikey.key===""?"None":this.props.user.twitterapikey.key} </Text>
            <NBItem>
              <Icon style={styles(this.props.user.colorTheme).icon} name='logo-twitter' size={20}/>
              <NBInput placeholder='Twitter API Key' value={this.state.twitterApiKey.key} style={fontsStyles(this.props.user.font).ui} onChangeText={(value: string)=>{
                var twitterkeys = this.state.twitterApiKey;
                twitterkeys.key = value;
                this.setState({twitterApiKey:twitterkeys});
              }}/>
              <TouchableOpacity onPress={()=>{
                //how to get twiiter api key?
                Linking.openURL('https://themepacific.com/how-to-generate-api-key-consumer-token-access-key-for-twitter-oauth/994/');
              }}>
                <Icon style={styles(this.props.user.colorTheme).icon} name="md-help-circle-outline" size={20}/>
              </TouchableOpacity>
            </NBItem>

            <View style={styles(this.props.user.colorTheme).smallDivider}/>

            <Text style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).apikeys]}> Current Twitter Secret Key: {this.props.user.twitterapikey.secretKey===""?"None":this.props.user.twitterapikey.secretKey} </Text>
            <NBItem>
              <Icon style={styles(this.props.user.colorTheme).icon} name='logo-twitter' size={20}/>
              <NBInput placeholder='Twitter Secret Key' value={this.state.twitterApiKey.secretKey} style={fontsStyles(this.props.user.font).ui} onChangeText={(value: string)=>{
                var twitterkeys = this.state.twitterApiKey;
                twitterkeys.secretKey = value;
                this.setState({twitterApiKey:twitterkeys});
              }}/>
              <TouchableOpacity onPress={()=>{
                //how to get twiiter api key?
                Linking.openURL('https://themepacific.com/how-to-generate-api-key-consumer-token-access-key-for-twitter-oauth/994/');
              }}>
                <Icon style={styles(this.props.user.colorTheme).icon} name="md-help-circle-outline" size={20}/>
              </TouchableOpacity>
            </NBItem>

            <View style={styles(this.props.user.colorTheme).smallDivider}/>

            <Text style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).apikeys]}> Current Twitter API Token: {this.props.user.twitterapikey.token===""?"None":this.props.user.twitterapikey.token} </Text>
            <NBItem>
              <Icon style={styles(this.props.user.colorTheme).icon} name='logo-twitter' size={20}/>
              <NBInput placeholder='Twitter API Token' value={this.state.twitterApiKey.token} style={fontsStyles(this.props.user.font).ui} onChangeText={(value: string)=>{
                var twitterkeys = this.state.twitterApiKey;
                twitterkeys.token = value;
                this.setState({twitterApiKey:twitterkeys});
              }}/>
              <TouchableOpacity onPress={()=>{
                //how to get twiiter api key?
                Linking.openURL('https://themepacific.com/how-to-generate-api-key-consumer-token-access-key-for-twitter-oauth/994/');
              }}>
                <Icon style={styles(this.props.user.colorTheme).icon} name="md-help-circle-outline" size={20}/>
              </TouchableOpacity>
            </NBItem>

            <View style={styles(this.props.user.colorTheme).smallDivider}/>

            <Text style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).apikeys]}> Current Twitter Secret Token: {this.props.user.twitterapikey.secretToken===""?"None":this.props.user.twitterapikey.secretToken} </Text>
            <NBItem last>
              <Icon style={styles(this.props.user.colorTheme).icon} name='logo-twitter' size={20}/>
              <NBInput placeholder='Twitter Secret Token' value={this.state.twitterApiKey.secretToken} style={fontsStyles(this.props.user.font).ui} onChangeText={(value: string)=>{
                var twitterkeys = this.state.twitterApiKey;
                twitterkeys.secretToken = value;
                this.setState({twitterApiKey:twitterkeys});
              }}/>
              <TouchableOpacity onPress={()=>{
                //how to get twiiter api key?
                Linking.openURL('https://themepacific.com/how-to-generate-api-key-consumer-token-access-key-for-twitter-oauth/994/');
              }}>
                <Icon style={styles(this.props.user.colorTheme).icon} name="md-help-circle-outline" size={20}/>
              </TouchableOpacity>
            </NBItem>

            <View style={styles(this.props.user.colorTheme).smallDivider}/>

            <NBButton full light onPress={()=>{//on submit
              if (this.state.twitterApiKey !== this.props.user.twitterapikey) {// if updated twitter key
                var twitterapikey = {
                  key: this.state.twitterApiKey.key!=="" ? this.state.twitterApiKey.key : this.props.user.twitterapikey.key,
                  secretKey: this.state.twitterApiKey.secretKey!=="" ? this.state.twitterApiKey.secretKey : this.props.user.twitterapikey.secretKey,
                  token: this.state.twitterApiKey.token!=="" ? this.state.twitterApiKey.token : this.props.user.twitterapikey.token,
                  secretToken: this.state.twitterApiKey.secretToken!=="" ? this.state.twitterApiKey.secretToken : this.props.user.twitterapikey.secretToken
                };
                putTwitterapikey(this.props.user.name, this.props.user.password, twitterapikey, this.props.putTwitterAPIKeyBegin, this.props.putTwitterAPIKeySuccess, this.props.putTwitterAPIKeyFailure);
                this.setState({twitterApiKey:{key:"",secretKey:"",token:"",secretToken:""}});
              }
              if (this.state.googleApiKey !== this.props.user.googleapikey) {// if updated youtube key
                var googleapikey = this.state.googleApiKey!=="" ? this.state.googleApiKey : this.props.user.googleapikey;
                putGoogleapikey(this.props.user.name, this.props.user.password, googleapikey, this.props.putGoogleAPIKeyBegin, this.props.putGoogleAPIKeySuccess, this.props.putGoogleAPIKeyFailure);
                this.setState({googleApiKey : ""});
              }
            }}>
              <NBText style={fontsStyles(this.props.user.font).ui}>Setup API Key</NBText>
            </NBButton>

            <View style={styles(this.props.user.colorTheme).smallDivider}/>

            <NBButton full danger onPress={()=>{
                var googleapikey = "";
                putGoogleapikey(this.props.user.name, this.props.user.password, googleapikey, this.props.putGoogleAPIKeyBegin, this.props.putGoogleAPIKeySuccess, this.props.putGoogleAPIKeyFailure);
                this.setState({googleApiKey : ""});
            }}>
              <NBText style={fontsStyles(this.props.user.font).ui}>Reset Youtube API Key</NBText>
            </NBButton>

            <View style={styles(this.props.user.colorTheme).smallDivider}/>

            <NBButton full danger onPress={()=>{
              var twitterapikey = {key:"",secretKey:"",token:"",secretToken:""};
              putTwitterapikey(this.props.user.name, this.props.user.password, twitterapikey, this.props.putTwitterAPIKeyBegin, this.props.putTwitterAPIKeySuccess, this.props.putTwitterAPIKeyFailure);
              this.setState({twitterApiKey:{key:"",secretKey:"",token:"",secretToken:""}});
            }}>
              <NBText style={fontsStyles(this.props.user.font).ui}>Reset Twitter API Key</NBText>
            </NBButton>

            <View style={styles(this.props.user.colorTheme).smallDivider}/>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ManageAPIScreen)
