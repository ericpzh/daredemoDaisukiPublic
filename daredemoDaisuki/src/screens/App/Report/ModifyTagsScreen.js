import React from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, ScrollView, FlatList, Text, Modal } from 'react-native';
import { Header } from 'react-navigation';
import { Item as NBItem, Button as NBButton, Input as NBInput, Text as NBText, Toast as NBToast, Thumbnail as NBThumbnail, Badge as NBBadge, Fab as NBFab,  Footer as NBFooter, FooterTab as NBFooterTab, Content as NBContent,  } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import DialogInput from 'react-native-dialog-input';

import { styles, fontsStyles } from '../../../styles/App/Report/modifyTagsScreenStyles.js';
import altImg from '../../../assets/altImg.jpg';
import { addTags, removeTags } from '../../../api/suggestions.js';
import { fetchImageBeginYoutube, fetchImageSuccessYoutube, fetchImageFailureYoutube, fetchImageBeginTwitter, fetchImageSuccessTwitter, fetchImageFailureTwitter, fetchImageBeginBili, fetchImageSuccessBili, fetchImageFailureBili, fetchVtubersBegin, fetchVtubersSuccess, fetchVtubersFailure } from '../../../actions/vtuberActions.js';
import { reset, modifyTagsBegin, modifyTagsSuccess, modifyTagsFailure, fetchVtuberBegin, fetchVtuberSuccess, fetchVtuberFailure } from '../../../actions/reportActions.js';
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
  modifyTagsBegin: () => dispatch(modifyTagsBegin()),
  modifyTagsSuccess: (input) => dispatch(modifyTagsSuccess(input)),
  modifyTagsFailure: () => dispatch(modifyTagsFailure()),
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
  fetchVtubersBegin: () => dispatch(fetchVtubersBegin()),
  fetchVtubersSuccess: (input) => dispatch(fetchVtubersSuccess(input)),
  fetchVtubersFailure: () => dispatch(fetchVtubersFailure()),
});

class ModifyTagsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enname: "",
      tags: [],
      additionTags: [],
      search: "",
      modalVisible: false,
      passwordVisible: false,
    }
    this.buildData = this.buildData.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }
  componentDidMount(){
    this.props.reset();
  }
  componentDidUpdate(prevProps){
    if(prevProps.report.loadingSuggestion&& !this.props.report.loadingSuggestion && this.props.report.suggestions !== prevProps.report.suggestions){//success
      this.setState({ enname: "", search: "", tags: [], additionTags: [], passwordVisible: false});//cleanup
      getAllVtubers([this.state.enname], this.props.fetchVtubersBegin, this.props.fetchVtubersSuccess, this.props.fetchVtubersFailure);//update vtubers
      this.props.reset();//reload
      NBToast.show({
        text: 'Thanks for the suggestion',
        duration: 3000,
        type: "success",
      });
    }else if(prevProps.report.loadingSuggestion&& !this.props.report.loadingSuggestion){//failure
      this.setState({ enname: "", search: "", tags: [], additionTags: [], passwordVisible: false});//cleanup
      getAllVtubers([this.state.enname], this.props.fetchVtubersBegin, this.props.fetchVtubersSuccess, this.props.fetchVtubersFailure);//update vtubers
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
        })
      })
    }else{//serach result
      this.props.report.vtubers.map((vtuber)=>{
        data.push({
          name: vtuber.name,
          enname: vtuber.enname,
          image: this.props.vtuber.vtubersImage[vtuber.enname],
          tags: vtuber.tags,
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
                        this.setState({enname:item.enname,tags: item.tags});
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
        <View style={styles(this.props.user.colorTheme).scrollContainer}>
          <Modal
            animationType="fade"
            transparent={false}
            visible={this.props.report.loading}
            onRequestClose={() => {
            }}>
            <View style={styles(this.props.user.colorTheme).modalContainer}><LoadingComponent duration={1000}/></View>
          </Modal>
          <DialogInput isDialogVisible={this.state.modalVisible}
            title={"New Tag"}
            message={"Input New Tag:"}
            hintInput ={""}
            submitInput={ (input) => {
              if (input !== ""){
                var newTag = [input];
                this.setState({ additionTags: [...this.state.additionTags,...newTag], modalVisible: false})
              }
            }}
            closeDialog={ ()=>{ this.setState({ modalVisible: false}) } }>
          </DialogInput>
          <DialogInput isDialogVisible={this.state.passwordVisible}
            title={"Password"}
            message={"Input Your Password:"}
            hintInput ={""}
            submitInput={ (input) => {
              if (input !== ""){
                addTags(this.props.user.name, input, this.state.enname, this.state.additionTags, this.props.modifyTagsBegin, this.props.modifyTagsSuccess, this.props.modifyTagsFailure)//confirm
              }
            }}
            closeDialog={ ()=>{ this.setState({ passwordVisible: false}) } }>
          </DialogInput>
          <NBContent contentContainerStyle={styles(this.props.user.colorTheme).tagsContainer}>
            {
              [...this.state.tags,...this.state.additionTags].map((tag) => {//all tags
                return (<NBBadge key={tag} style={styles(this.props.user.colorTheme).badgeEdit}>
                  <NBText style={styles(this.props.user.colorTheme).badgeTextEdit}>
                    {tag}
                  </NBText>
                </NBBadge>)
              })
            }
          </NBContent>
          <NBFooter>
            <NBFooterTab>
              <NBButton full light onPress={()=>{ this.setState({ enname: "", tags: [], additionTags: []}) }}>
                <NBText style={styles(this.props.user.colorTheme).footerText}> Cancel </NBText>
              </NBButton>
            </NBFooterTab>
            <NBFooterTab>
              <NBButton full success onPress={()=>{ this.setState({passwordVisible: true}); }}>
                <NBText style={[{color:'white'},styles(this.props.user.colorTheme).footerText]}> Confirm </NBText>
              </NBButton>
            </NBFooterTab>
          </NBFooter>
          <NBFab
            active={false}
            style={styles(this.props.user.colorTheme).fab}
            position="bottomRight"
            onPress={()=>{ this.setState({modalVisible:true}) }}>
            <Icon name={"md-add"} />
          </NBFab>
        </View>
      );
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ModifyTagsScreen);
