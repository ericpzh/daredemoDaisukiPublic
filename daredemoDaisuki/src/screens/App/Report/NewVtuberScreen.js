import React from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, ScrollView, Text, Modal, Keyboard, Platform } from 'react-native';
import { Header } from 'react-navigation';
import { Item as NBItem, Button as NBButton, Input as NBInput, Text as NBText, Toast as NBToast, Footer as NBFooter, FooterTab as NBFooterTab, Content as NBContent, Picker as NBPicker } from 'native-base';
import DialogInput from 'react-native-dialog-input';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { styles, fontsStyles } from '../../../styles/App/Report/newVtuberScreenStyles.js';
import { postSuggestions } from '../../../api/suggestions.js';
import { reset, postSuggestionBegin, postSuggestionSuccess, postSuggestionFailure } from '../../../actions/reportActions.js';
import  LoadingComponent  from '../../../assets/loading.js';

const mapStateToProps = (state) => {
  const { user, vtuber, report } = state
  return { user, vtuber, report }
};


const mapDispatchToProps = dispatch => ({
  postSuggestionBegin: () => dispatch( postSuggestionBegin()),
  postSuggestionSuccess: (input) => dispatch( postSuggestionSuccess(input)),
  postSuggestionFailure: () => dispatch( postSuggestionFailure()),
});

class NewVtuberScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      jnName: "",
      enName: "",
      youtubeId: "",
      twitterId: "",
      biliId: "",
      tag: "",
      source: "youtube",
      keyboardAvoidingViewKey: 'keyboardAvoidingViewKey',
    }
    this.keyboardHideListener = this.keyboardHideListener.bind(this);
  }
  componentDidMount() {
    // using keyboardWillHide is better but it does not work for android
    this.keyboardHideListener = Keyboard.addListener(Platform.OS === 'android' ? 'keyboardDidHide': 'keyboardWillHide', this.keyboardHideListener.bind(this));
  }

  componentWillUnmount() {
    this.keyboardHideListener.remove()
  }
  componentDidUpdate(prevProps){
    if(prevProps.report.loadingSuggestion&& !this.props.report.loadingSuggestion && this.props.report.suggestions !== prevProps.report.suggestions){//post success
      this.setState({ enName: "", jnName: "", youtubeId: "", twitterId: "",  biliId: "", tag: "", modalVisible: false, source: "youtube"});//cleanup
      NBToast.show({
        text: 'Thanks for the suggestion',
        duration: 3000,
        type: "success",
      });
    }else if(prevProps.report.loadingSuggestion&& !this.props.report.loadingSuggestion){
      this.setState({ enName: "", jnName: "", youtubeId: "", twitterId: "",  biliId: "", tag: "", modalVisible: false, source: "youtube"});//cleanup
      NBToast.show({
        text: 'Error, please try again',
        duration: 3000,
        type: "danger",
      });
    }
  }
  keyboardHideListener() {
    this.setState({
        keyboardAvoidingViewKey:'keyboardAvoidingViewKey' + new Date().getTime()
    });
  }
  render() {
    return (
      <View style={styles(this.props.user.colorTheme).contentContainer}>
        <Modal
          animationType="fade"
          transparent={false}
          visible={this.props.report.loadingSuggestion}
          onRequestClose={() => {
          }}>
          <View style={styles(this.props.user.colorTheme).modalContainer}><LoadingComponent duration={1000}/></View>
        </Modal>
        <DialogInput isDialogVisible={this.state.modalVisible}
          title={"Password"}
          message={"Input Your Password:"}
          hintInput ={""}
          submitInput={ (input) => {
            if (input !== ""){
              var now = new Date();
              var biliId = this.state.biliId!==""?this.state.biliId:"0";
              var tags = this.state.tag !== "" ? [this.state.tag] : [];
              postSuggestions(input, this.props.user.name, now, this.state.jnName, this.state.enName, this.state.youtubeId, this.state.twitterId, biliId, tags, this.state.source, this.props.postSuggestionBegin, this.props.postSuggestionSuccess,this.props.postSuggestionFailure);
            }
          }}
          closeDialog={ ()=>{ this.setState({ modalVisible: false}) } }>
        </DialogInput>
        <NBContent>
          <KeyboardAvoidingView key={this.state.keyboardAvoidingViewKey} style={styles(this.props.user.colorTheme).keyboardAvoidingView} behavior="height" keyboardVerticalOffset = {80}>
            <ScrollView style={styles(this.props.user.colorTheme).scrollContainer} >
              <NBItem>
                <NBText note> Japanese Name: </NBText>
                <NBInput value={this.state.jnName} style={fontsStyles(this.props.user.font).ui} onChangeText={(value: string)=>{this.setState({jnName:value})}} />
              </NBItem>

              <NBItem>
                <NBText note> English Name: </NBText>
                <NBInput value={this.state.enName} style={fontsStyles(this.props.user.font).ui} onChangeText={(value: string)=>{this.setState({enName:value})}} />
              </NBItem>

              <NBItem>
                <NBText note> Youtube Id: </NBText>
                <NBInput value={this.state.youtubeId} style={fontsStyles(this.props.user.font).ui} onChangeText={(value: string)=>{this.setState({youtubeId:value})}} />
              </NBItem>

              <NBItem>
                <NBText note> Twitter Id: </NBText>
                <NBInput value={this.state.twitterId} style={fontsStyles(this.props.user.font).ui} onChangeText={(value: string)=>{this.setState({twitterId:value})}} />
              </NBItem>

              <NBItem>
                <NBText note> Bilibili Id: </NBText>
                <NBInput value={this.state.biliId} placeholder="Keep Empty If None" style={fontsStyles(this.props.user.font).ui} onChangeText={(value: string)=>{this.setState({biliId:value})}} />
              </NBItem>

              <NBItem>
                <NBText note> Tag: </NBText>
                <NBInput value={this.state.tag} placeholder="Keep Empty If None" style={fontsStyles(this.props.user.font).ui} onChangeText={(value: string)=>{this.setState({tag:value})}} />
              </NBItem>

              <NBItem>
                <NBText note> Thumbnail Source: </NBText>
                <NBPicker
                  mode="dropdown"
                  style={styles(this.props.user.colorTheme).picker}
                  selectedValue={this.state.source}
                  onValueChange={(value: string) => {
                    this.setState({source:value})
                  }}
                >
                  <NBPicker.Item label="Youtube" value="youtube" style={styles(this.props.user.colorTheme).pickerItem}/>
                  <NBPicker.Item label="Twitter" value="twitter" style={styles(this.props.user.colorTheme).pickerItem}/>
                  <NBPicker.Item label="Bilibili" value="bilibili" style={styles(this.props.user.colorTheme).pickerItem}/>
                </NBPicker>
              </NBItem>
            </ScrollView>
          </KeyboardAvoidingView>
        </NBContent>
        <NBFooter>
          <NBFooterTab>
            <NBButton full light onPress={()=>{
              this.setState({jnName: "", enName: "", youtubeId: "", twitterId: "", biliId: "", tag: "", source: "youtube"});
              this.props.navigation.goBack();
            }}>
              <NBText style={styles(this.props.user.colorTheme).footerText}> Cancel </NBText>
            </NBButton>
          </NBFooterTab>
          <NBFooterTab>
            <NBButton full success onPress={()=>{
              if(this.state.jnName!==""&&this.state.enName&&this.state.youtubeId!==""&&this.state.twitterId!==""){//all field finished
                this.setState({modalVisible: true});
              }else{//missing info
                NBToast.show({
                  text: 'Fill In Names, Youtube & Twitter ID',
                  duration: 2000,
                  type: "danger",
                })
              }
            }}>
              <NBText style={[{color:'white'},styles(this.props.user.colorTheme).footerText]}> Confirm </NBText>
            </NBButton>
          </NBFooterTab>
        </NBFooter>
      </View>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(NewVtuberScreen);
