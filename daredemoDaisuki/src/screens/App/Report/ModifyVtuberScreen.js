import React from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, ScrollView, FlatList, Text, Modal, Keyboard } from 'react-native';
import { Header } from 'react-navigation';
import { Item as NBItem, Button as NBButton, Input as NBInput, Text as NBText, Toast as NBToast, Thumbnail as NBThumbnail, Badge as NBBadge, Footer as NBFooter, FooterTab as NBFooterTab, Content as NBContent } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import DialogInput from 'react-native-dialog-input';

import { styles, fontsStyles } from '../../../styles/App/Report/modifyVtuberScreenStyles.js';
import altImg from '../../../assets/altImg.jpg';
import { postSuggestions } from '../../../api/suggestions.js';
import { fetchImageBeginYoutube, fetchImageSuccessYoutube, fetchImageFailureYoutube, fetchImageBeginTwitter, fetchImageSuccessTwitter, fetchImageFailureTwitter, fetchImageBeginBili, fetchImageSuccessBili, fetchImageFailureBili } from '../../../actions/vtuberActions.js';
import { reset, fetchVtuberBegin, fetchVtuberSuccess, fetchVtuberFailure, postSuggestionBegin, postSuggestionSuccess, postSuggestionFailure } from '../../../actions/reportActions.js';
import { queryVtubers } from '../../../api/vtubers.js';
import { getUsers } from '../../../api/twitter.js';
import { getAccountById } from '../../../api/bilibili.js';
import { getChannelsIDs } from '../../../api/youtube.js';
import { getAllVtubers } from '../../../api/vtubers.js';
import { imageFetch } from '../../../api/custom.js';
import  LoadingComponent  from '../../../assets/loading.js';

const mapStateToProps = (state) => {
  const { user, vtuber, report } = state
  return { user, vtuber, report }
};

const mapDispatchToProps = dispatch => ({
  reset: () => dispatch(reset()),
  fetchVtuberBegin: () => dispatch(fetchVtuberBegin()),
  fetchVtuberSuccess: (input) => dispatch(fetchVtuberSuccess(input)),
  fetchVtuberFailure: () => dispatch(fetchVtuberFailure()),
  fetchImageBeginYoutube: () => dispatch(fetchImageBeginYoutube()),
  fetchImageSuccessYoutube: (input) => dispatch(fetchImageSuccessYoutube(input)),
  fetchImageFailureYoutube: () => dispatch(fetchImageFailureYoutube()),
  fetchImageBeginTwitter: () => dispatch(fetchImageBeginTwitter()),
  fetchImageSuccessTwitter: (input) => dispatch(fetchImageSuccessTwitter(input)),
  fetchImageFailureTwitter: () => dispatch(fetchImageFailureTwitter()),
  fetchImageBeginBili: () => dispatch(fetchImageBeginBili()),
  fetchImageSuccessBili: (input) => dispatch(fetchImageSuccessBili(input)),
  fetchImageFailureBili: () => dispatch(fetchImageFailureBili()),
  postSuggestionBegin: () => dispatch( postSuggestionBegin()),
  postSuggestionSuccess: (input) => dispatch( postSuggestionSuccess(input)),
  postSuggestionFailure: () => dispatch( postSuggestionFailure()),
});

class ModifyVtuberScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      enname: "",
      search: "",
      jnName: "",
      youtubeId: "",
      twitterId: "",
      biliId: "",
      vtuber: {},
    }
    this.buildData = this.buildData.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }
  componentDidMount(){
    this.props.reset();
  }
  componentDidUpdate(prevProps){
    if(prevProps.report.loadingSuggestion&& !this.props.report.loadingSuggestion && this.props.report.suggestions !== prevProps.report.suggestions){//post success
      this.setState({ enname: "", search: "", jnName: "", youtubeId: "", twitterId: "",  biliId: "", vtuber:{}, modalVisible: false});//cleanup
      this.props.reset();//reload
      NBToast.show({
        text: 'Thanks for the suggestion',
        duration: 3000,
        type: "success",
      });
    }else if(prevProps.report.loadingSuggestion&& !this.props.report.loadingSuggestion){
      this.setState({ enname: "", search: "", jnName: "", youtubeId: "", twitterId: "",  biliId: "", vtuber:{}, modalVisible: false});//cleanup
      this.props.reset();//reload
      NBToast.show({
        text: 'Error, please try again',
        duration: 3000,
        type: "danger",
      });
    }else if(prevProps.report.loading && !this.props.report.loading){//done loading vtuber
      var missingImage = this.props.report.vtubers
      .filter((vtuber)=>{return !this.props.vtuber.vtubersImage[vtuber.enname]})//vtuber not subscribed by user = not fetch initially
      imageFetch(missingImage,getChannelsIDs,getUsers, getAccountById,this.props.fetchImageBeginYoutube,this.props.fetchImageSuccessYoutube,this.props.fetchImageFailureYoutube,this.props.fetchImageBeginTwitter,this.props.fetchImageSuccessTwitter,this.props.fetchImageFailureTwitter,this.props.fetchImageBeginBili,this.props.fetchImageSuccessBili,this.props.fetchImageFailureBili,this.props.user.googleapikey,this.props.user.twitterapikey);
    }
  }
  onSearch(){
    /*
    when hit 'search'
    */
    if (this.state.search !== ""){
      queryVtubers(this.state.search, this.props.fetchVtuberBegin, this.props.fetchVtuberSuccess, this.props.fetchVtuberFailure);
    }else{
      NBToast.show({
        text: 'Fill In The Search Field',
        duration: 2000,
        type: "danger",
      })
    }
  }
  buildData(){
    /*
    Parse data
    */
    var data = [];//data array to be returned
    if(this.props.report.vtubers.length === 0){//init with subs
      this.props.user.subscriptions.forEach((vtuber)=>{
        data.push({
          name: this.props.vtuber.vtubersDict[vtuber]?this.props.vtuber.vtubersDict[vtuber].name:vtuber,
          enname: vtuber,
          image: this.props.vtuber.vtubersImage[vtuber],
          tags: this.props.vtuber.vtubersDict[vtuber]?this.props.vtuber.vtubersDict[vtuber].tags:vtuber,
          youtubeId: this.props.vtuber.vtubersDict[vtuber]?this.props.vtuber.vtubersDict[vtuber].youtubeId:vtuber,
          twitterId: this.props.vtuber.vtubersDict[vtuber]?this.props.vtuber.vtubersDict[vtuber].twitterId:vtuber,
          biliId: this.props.vtuber.vtubersDict[vtuber]?this.props.vtuber.vtubersDict[vtuber].biliId:vtuber,
          thumbnailSource: this.props.vtuber.vtubersDict[vtuber]?this.props.vtuber.vtubersDict[vtuber].thumbnailSource:vtuber,
        })
      })
    }else{//serach result
      this.props.report.vtubers.map((vtuber)=>{
        data.push({
          name: vtuber.name,
          enname: vtuber.enname,
          image: this.props.vtuber.vtubersImage[vtuber.enname],
          tags: vtuber.tags,
          youtubeId: vtuber.youtubeId,
          twitterId: vtuber.twitterId,
          biliId: vtuber.biliId,
          thumbnailSource: vtuber.thumbnailSource,
        })
      })
    }
    return data;
  }
  render() {
    if(this.state.enname === ""){
      return (
        <View style={styles(this.props.user.colorTheme).container}>
          <Modal
            animationType="fade"
            transparent={false}
            visible={this.props.report.loading}
            onRequestClose={() => {
            }}>
            <View style={styles(this.props.user.colorTheme).modalContainer}><LoadingComponent duration={1000}/></View>
          </Modal>
          <NBItem>
            <NBText note> Search Vtuber </NBText>
            <NBInput value={this.state.search} style={fontsStyles(this.props.user.font).ui} onChangeText={(value: string)=>{this.setState({search:value})}} autoFocus onSubmitEditing={this.onSearch}/>
            <TouchableOpacity onPress={ this.onSearch }>
              <Icon style={styles(this.props.user.colorTheme).icon} name='md-search' size={20}/>
            </TouchableOpacity>
          </NBItem>
          <FlatList
            ref={(ref) => { this.flatListRef = ref; }}
            renderItem={({item, index}) => {
                return (
                  <View key={index} style={styles(this.props.user.colorTheme).listItem}>
                    <View style={styles(this.props.user.colorTheme).listItemHeader}>
                      <NBThumbnail   style={styles(this.props.user.colorTheme).listItemHeaderImage} source={item.image ?{ uri: item.image  }: altImg} />
                      <View style={styles(this.props.user.colorTheme).listItemHeaderTextWrapper}>
                        <Text style={styles(this.props.user.colorTheme).listItemHeaderText}>{item.name}</Text>
                        <Text style={styles(this.props.user.colorTheme).listItemHeaderSubText}>{item.enname}</Text>
                      </View>
                      <TouchableOpacity style={styles(this.props.user.colorTheme).listItemButton} onPress={()=>{
                        this.setState({enname:item.enname,vtuber:item, jnName: item.name, youtubeId: item.youtubeId, twitterId: item.twitterId, biliId: item.biliId });
                      }}>
                        <Icon name='md-checkmark' size={20} style={styles(this.props.user.colorTheme).listItemButtonIcon}/>
                      </TouchableOpacity>
                    </View>
                    <View style={styles(this.props.user.colorTheme).tags}>
                    {
                      item.tags.length > 10
                      ?
                      item.tags.sort(() => 0.5 - Math.random()).slice(0, 10).map((tag) => {//ramdom 10 tags
                        return (<NBBadge key={tag} style={styles(this.props.user.colorTheme).badge}>
                          <NBText style={styles(this.props.user.colorTheme).badgeText}>
                            {tag}
                          </NBText>
                        </NBBadge>)
                      })
                      :
                      item.tags.map((tag) => {//all tags
                        return (<NBBadge key={tag} style={styles(this.props.user.colorTheme).badge}>
                          <NBText style={styles(this.props.user.colorTheme).badgeText}>
                            {tag}
                          </NBText>
                        </NBBadge>)
                      })
                    }
                    </View>
                  </View>
                )
              }
            }
            data = {this.buildData()}
            keyExtractor={(item, index) => item + index}
            />
        </View>
      );
    }else{
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
                postSuggestions(input, this.props.user.name, now, this.state.jnName, this.state.enname, this.state.youtubeId, this.state.twitterId, biliId, this.state.vtuber.tags, this.state.vtuber.thumbnailSource, this.props.postSuggestionBegin, this.props.postSuggestionSuccess,this.props.postSuggestionFailure);
              }
            }}
            closeDialog={ ()=>{ this.setState({ modalVisible: false}) } }>
          </DialogInput>
          <NBContent>
            <KeyboardAvoidingView style={styles(this.props.user.colorTheme).keyboardAvoidingView} behavior="position" keyboardVerticalOffset = {80}>
              <ScrollView style={styles(this.props.user.colorTheme).scrollContainer} >
                <View style={styles(this.props.user.colorTheme).contentItem}>
                  <NBThumbnail large style={styles(this.props.user.colorTheme).contentImage} source={this.props.vtuber.vtubersImage[this.state.enname] ?{ uri: this.props.vtuber.vtubersImage[this.state.enname]  }: altImg} />
                  <NBText style={styles(this.props.user.colorTheme).contentHeaderText}> {this.state.enname} </NBText>
                </View>

                <NBItem>
                  <NBText note> Japanese Name: </NBText>
                  <NBInput placeholder={this.state.vtuber.name} value={this.state.jnName} style={fontsStyles(this.props.user.font).ui} onChangeText={(value: string)=>{this.setState({jnName:value})}} onSubmitEditing={()=>{Keyboard.dismiss;}}/>
                </NBItem>

                <NBItem>
                  <NBText note> Youtube ID: </NBText>
                  <NBInput placeholder={this.state.vtuber.youtubeId} value={this.state.youtubeId} style={fontsStyles(this.props.user.font).ui} onChangeText={(value: string)=>{this.setState({youtubeId:value})}} onSubmitEditing={()=>{Keyboard.dismiss;}}/>
                </NBItem>

                <NBItem>
                  <NBText note> Twitter ID: </NBText>
                  <NBInput placeholder={this.state.vtuber.twitterId} value={this.state.twitterId} style={fontsStyles(this.props.user.font).ui} onChangeText={(value: string)=>{this.setState({twitterId:value})}} onSubmitEditing={()=>{Keyboard.dismiss;}}/>
                </NBItem>

                <NBItem>
                  <NBText note> Bilibili ID: </NBText>
                  <NBInput placeholder={this.state.vtuber.biliId==="0"? "(Keep Empty If None)" : this.state.vtuber.biliId + "(Keep Empty If None)"} value={this.state.biliId} style={fontsStyles(this.props.user.font).ui} onChangeText={(value: string)=>{this.setState({biliId:value})}} onSubmitEditing={()=>{Keyboard.dismiss;}}/>
                </NBItem>
              </ScrollView>
            </KeyboardAvoidingView>
          </NBContent>
          <NBFooter>
            <NBFooterTab>
              <NBButton full light onPress={()=>{ this.setState({ enname: "", search: "", jnName: "", youtubeId: "", twitterId: "",  biliId: "", vtuber:{}}); }}>
                <NBText style={styles(this.props.user.colorTheme).footerText}> Cancel </NBText>
              </NBButton>
            </NBFooterTab>
            <NBFooterTab>
              <NBButton full success onPress={()=>{
                if(this.state.jnName!==""&&this.state.youtubeId!==""&&this.state.twitterId!==""&&(this.state.name!==this.state.vtuber.name||this.state.youtubeId!==this.state.vtuber.youtubeId||this.state.twitterId!==this.state.vtuber.twitterId||this.state.biliId!==this.state.vtuber.biliId)){//all field finished
                  this.setState({modalVisible: true});
                }else{//missing info
                  NBToast.show({
                    text: 'Fill In Japanese Name, Youtube & Twitter ID',
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
}

export default connect(mapStateToProps,mapDispatchToProps)(ModifyVtuberScreen);
