import React from 'react';
import { Text, View, FlatList, Image, RefreshControl, TouchableOpacity, Modal, Linking } from 'react-native';
import { Thumbnail as NBThumbnail, ActionSheet as NBActionSheet, Fab as NBFab, Toast as NBToast } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';
import { ScreenOrientation } from 'expo';

import { styles, fontsStyles } from '../../../styles/App/biliScreenStyles.js';
import altImg from '../../../assets/altImg.jpg';
import { getAccount, getLiveAccount, getSubmitVideos } from '../../../api/bilibili.js';
import { fetchImageBeginBili, fetchImageSuccessBiliScreen, fetchImageFailureBili } from '../../../actions/vtuberActions.js';
import { fetchVideoBegin, fetchVideoSuccess, fetchVideoFailure } from '../../../actions/biliActions.js';
import { filterChanged, reset, init, fetchLiveBegin, fetchLiveSuccess, fetchLiveFailure } from '../../../actions/biliActions.js';
import  LoadingComponent  from '../../../assets/loading.js';
import { setPrevScreen } from '../../../actions/globalActions.js';
import Tutorial from './Tutorial.js';

const mapStateToProps = (state) => {
  const { bili, user, vtuber, global } = state
  return { bili, user, vtuber, global }
};

const mapDispatchToProps = dispatch => ({
  filterChanged: (group) => dispatch(filterChanged(group)),
  init: () => dispatch(init()),
  reset: () => dispatch(reset()),
  fetchLiveBegin: () =>  dispatch(fetchLiveBegin()),
  fetchLiveSuccess: (input) =>  dispatch(fetchLiveSuccess(input)),
  fetchLiveFailure: () =>  dispatch(fetchLiveFailure()),
  fetchVideoBegin: () =>  dispatch(fetchVideoBegin()),
  fetchVideoSuccess: (input) => dispatch(fetchVideoSuccess(input)),
  fetchVideoFailure: () =>  dispatch(fetchVideoFailure()),
  fetchImageBeginBili: () =>  dispatch(fetchImageBeginBili()),
  fetchImageSuccessBiliScreen: (input) => dispatch( fetchImageSuccessBiliScreen (input)),
  fetchImageFailureBili: () =>  dispatch(fetchImageFailureBili()),
  setPrevScreen: (input) => dispatch(setPrevScreen(input)),
});

class BiliScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastTap: null,
      //fullscreenId: "", //hold until valid api
      //webviews: {}, //hold until valid api
    }
    this.headerOnPressCallback=this.headerOnPressCallback.bind(this);
    this.tabOnPressCallback=this.tabOnPressCallback.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.buildActionSheet = this.buildActionSheet.bind(this);
    this.init = this.init.bind(this);
    this.changeScreenOrientation = this.changeScreenOrientation.bind(this);
  }
  async changeScreenOrientation(ori) {
    await ScreenOrientation.lockAsync(ori);
  }
  headerOnPressCallback(){
    /*
    Determine if double clicked, when double clicked, goto top
    */
    const now = Date.now();//clicked time
    const DOUBLE_PRESS_DELAY = 1000;//if 2 click within x sec
    if (this.state.lastTap && (now - this.state.lastTap) < DOUBLE_PRESS_DELAY && this.props.bili.account.length > 0) {//if 2 clicks within x sec & length > 0
      this.flatListRef.scrollToOffset({ animated: true, offset: 0 });//scroll to top
    } else {
      this.setState({lastTap : now});//update last tap time
    }
  }
  tabOnPressCallback(){
    this.flatListRef.scrollToOffset({ animated: true, offset: 0 });//scroll to top
  }
  componentDidMount(){
    if(willBlurSubscription){
      willBlurSubscription.remove();
    }
    let willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload => {
        this.props.setPrevScreen("BiliScreen");
      }
    );
    if(didFocusSubscription){
      didFocusSubscription.remove();
    }
    let didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        setTimeout(()=>{
          if(this.props.global.prevScreen === "SearchScreen" || this.props.global.prevScreen === "SubscriptionsScreen"){
            this.init();
          }
        },0)
      }
    );
    this.init();
  }
  init(){
    this.props.init();//reset props.bili
    while(this.props.vtuber.vtuberDict === {}){
      setTimeout(()=>{},50);
    }
    setTimeout(()=>{//allow redux change store
      this.onRefresh();
    },50);
    this.props.navigation.setParams({headerOnPressCallback: this.headerOnPressCallback, tabOnPressCallback: this.tabOnPressCallback, group: this.props.bili.group });//set header to current screen
  }
  componentDidUpdate(prevProps){
    if((prevProps.bili.group !== this.props.bili.group)){//group changes
      this.props.navigation.setParams({group: this.props.bili.group });//set header to current screen
    }
  }
  onRefresh(){
    /*
    Refresh all data
    */
    this.props.reset();//reset props.bili
    var subscriptions = [];//current list of vtuber supposed to be displayed
    var dict = {};
    if(this.props.bili.group === "Daredemo Daisuki"){//if all vtuber
      this.props.user.subscriptions.forEach((vtuber)=>{
        var biliId = this.props.vtuber.vtubersDict[vtuber].biliId;
        if(!(biliId in dict) && biliId !== "0"){//no repeat and no undefined id
          subscriptions.push(vtuber);
          dict[biliId] = 1;
        }
      });
    }else{//if selected group
      this.props.user.groups
      .filter((group)=>group.name===this.props.bili.group)[0].vtubers
      .forEach((vtuber)=>{
        var biliId = this.props.vtuber.vtubersDict[vtuber].biliId;
        if(!(biliId in dict) && biliId !== "0"){//no repeat and no undefined id
          subscriptions.push(vtuber);
          dict[biliId] = 1;
        }
      });
    }
    var missingImages = [];
    subscriptions.forEach((vtuber)=>{//check if missing bili image
      if(!(this.props.vtuber.vtubersDict[vtuber].biliId in this.props.vtuber.biliImage)){
        missingImages.push(vtuber);
      }
    })
    setTimeout(()=>{//allow redux change store
      getLiveAccount(subscriptions, this.props.vtuber.vtubersDict,this.props.fetchLiveBegin, this.props.fetchLiveSuccess, this.props.fetchLiveFailure);//fetch live api
      getSubmitVideos(subscriptions, this.props.vtuber.vtubersDict, this.props.fetchVideoBegin, this.props.fetchVideoSuccess, this.props.fetchVideoFaliure, this.props.bili.currPage);//fetch video api
      if(missingImages.length > 0){
        getAccount(subscriptions, this.props.vtuber.vtubersDict, this.props.fetchImageBeginBili, this.props.fetchImageSuccessBiliScreen,this.props.fetchImageFailureBili); //fetch account api
      }
    },0)
  }
  onEndReached(){
    /*
    Get more data
    */
    /*
    Refresh all data
    */
    var subscriptions = [];//current list of vtuber supposed to be displayed
    var dict = {};
    if(this.props.bili.group === "Daredemo Daisuki"){//if all vtuber
      this.props.user.subscriptions.forEach((vtuber)=>{
        var biliId = this.props.vtuber.vtubersDict[vtuber].biliId;
        if(!(biliId in dict) && biliId !== "0"){//no repeat and no undefined id
          subscriptions.push(vtuber);
          dict[biliId] = 1;
        }
      });
    }else{//if selected group
      this.props.user.groups
      .filter((group)=>group.name===this.props.bili.group)[0].vtubers
      .forEach((vtuber)=>{
        var biliId = this.props.vtuber.vtubersDict[vtuber].biliId;
        if(!(biliId in dict) && biliId !== "0"){//no repeat and no undefined id
          subscriptions.push(vtuber);
          dict[biliId] = 1;
        }
      });
    }
    var missingImages = [];
    subscriptions.forEach((vtuber)=>{//check if missing bili image
      if(!(this.props.vtuber.vtubersDict[vtuber].biliId in this.props.vtuber.biliImage)){
        missingImages.push(vtuber);
      }
    })
    setTimeout(()=>{//allow redux change store
      getSubmitVideos(subscriptions, this.props.vtuber.vtubersDict, this.props.fetchVideoBegin, this.props.fetchVideoSuccess, this.props.fetchVideoFaliure, this.props.bili.currPage);//fetch video api
      if(missingImages.length > 0){
        getAccount(subscriptions, this.props.vtuber.vtubersDict, this.props.fetchImageBeginBili, this.props.fetchImageSuccessBiliScreen,this.props.fetchImageFailureBili); //fetch account api
      }
    },0)
  }
  buildActionSheet(){
    /*
    Render Select Group Action Sheet
    */
    if(this.props.user.groups.length === 0){//if not group, show toast
      NBToast.show({
        text: 'Create groups in "Groups"',
        duration: 2000,
      })
    }else{//if has group, show actionsheet
      var arr = ["Daredemo Daisuki"];//array
      if (this.props && this.props.user && this.props.user.groups){//if have groups
        this.props.user.groups.forEach((group)=>{//for each group add group name
          arr.push(group['name']);
        })
      }
      NBActionSheet.show({
          options: arr,
          title: "Select Group"
        },
        index => {
          if(arr[index]){
            this.props.filterChanged(arr[index]);
            setTimeout(()=>this.onRefresh(),50);
          }
        }
      )
    }
  }
  render() {
    return (
      <View style={styles(this.props.user.colorTheme).container}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.props.bili.loadingVideo || this.props.vtuber.loadingImageBili || this.props.bili.loadingLive}
          onRequestClose={() => {
          }}>
          <View style={styles(this.props.user.colorTheme).modalContainer}><LoadingComponent duration={1000}/></View>
        </Modal>
        <View style={styles(this.props.user.colorTheme).listContainer}>
          {
            this.props.user.subscriptions.length === 0
            ?
            <Tutorial/>
            :
            <FlatList
              ref={(ref) => { this.flatListRef = ref; }}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={this.onRefresh}
                />
              }
              renderItem={({item, index}) => (
                 <View>
                {
                  index == 0 && this.props.bili.live.filter(v=>v.liveStatus).length > 0 &&
                  <View style={styles(this.props.user.colorTheme).horizontalListContainer}>
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                      renderItem={({item, index}) => (
                        <TouchableOpacity style={styles(this.props.user.colorTheme).horizontalListItem} onPress={() =>
                          {Linking.openURL(item.url).catch((err) => console.error('An error occurred', err))}
                        }>
                          <NBThumbnail
                            style={styles(this.props.user.colorTheme).horizontalListItemImage}
                            source={this.props.vtuber.biliImage[item.mid]
                              ? {uri: this.props.vtuber.biliImage[item.mid]
                              }: altImg}
                          />
                        </TouchableOpacity>
                      )}
                      data = {this.props.bili.live.filter(v=>v.liveStatus)}
                      keyExtractor={(item, index) => item + index}
                      />
                  </View>
                }
                  <View key={index} style={styles(this.props.user.colorTheme).listItem}>
                    <View style={styles(this.props.user.colorTheme).listItemHeader}>
                      <TouchableOpacity onPress={() =>
                        {Linking.openURL("https://space.bilibili.com/"+item.mid).catch((err) => console.error('An error occurred', err))}
                        }
                        style={styles(this.props.user.colorTheme).listItemHeaderImageWrapper}
                      >
                        <Image
                          style={styles(this.props.user.colorTheme).listItemHeaderImage}
                          source={this.props.vtuber.biliImage[item.mid]
                            ? {uri: this.props.vtuber.biliImage[item.mid]
                            }: altImg}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() =>
                        {Linking.openURL("https://www.bilibili.com/video/av"+item.aid).catch((err) => console.error('An error occurred', err))}
                        }
                        style={styles(this.props.user.colorTheme).listItemHeaderTextWrapper}
                      >
                        <Text numberOfLines={2} style={[styles(this.props.user.colorTheme).listItemHeaderText,fontsStyles(this.props.user.font).headercn]}>{item.title}</Text>
                        <Text numberOfLines={1} style={[styles(this.props.user.colorTheme).listItemHeaderSubText,fontsStyles(this.props.user.font).subheadercn]}>{item.name}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles(this.props.user.colorTheme).listItemContent}>
                      <TouchableOpacity onPress={()=>{
                        Linking.openURL("https://www.bilibili.com/video/av"+item.aid).catch((err) => console.error('An error occurred', err))
                      }}>
                        <Image
                          style={styles(this.props.user.colorTheme).listItemContentImage}
                          source={item.image?{uri:item.image}:altImg}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles(this.props.user.colorTheme).listItemFooter}>
                      <Text style={[styles(this.props.user.colorTheme).listItemFooterText,fontsStyles(this.props.user.font).textcn]}>{item.displaytime}</Text>
                    </View>
                  </View>
                </View>
              )}
              data = {this.props.bili.videos.sort(function(a,b){return b.time - a.time})}
              keyExtractor={(item, index) => item + index}
              ListFooterComponent={
                this.props.bili.videos.length > 0 && (
                  <TouchableOpacity style={styles(this.props.user.colorTheme).listFooter} onPress={() => this.onEndReached()}>
                    <Text style={fontsStyles(this.props.user.font).textcn}>Load More</Text>
                  </TouchableOpacity>
                )
              }
              onEndReached={() => this.onEndReached()}
              onEndReachedThreshold={0.05}
              />
            }
        </View>
        <NBFab
          active={false}
          style={styles(this.props.user.colorTheme).fab}
          position="bottomRight"
          onPress={() => {this.buildActionSheet()}}>
          <Icon name="md-funnel" />
        </NBFab>
      </View>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(BiliScreen)
/*
//Invalid Video API

<Modal
  animationType="slide"
  transparent={false}
  visible={this.state.fullscreenId!==""}
  onRequestClose={() => {
    this.changeScreenOrientation(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    this.setState({fullscreenId: ""});
  }}
  onDismiss={() => {
    this.changeScreenOrientation(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    this.setState({fullscreenId: ""});
  }}
>
    <View style={styles(this.props.user.colorTheme).fullscreenContainer}>
    <WebView
      style={styles(this.props.user.colorTheme).fullscreen}
      javaScriptEnabled={true}
      domStorageEnabled={false}
      source={{uri: 'https://www.bilibili.com/video/av' + this.state.fullscreenId }}
    />
    </View>
  </Modal>


  <WebView
    style={styles(this.props.user.colorTheme).listItemContentVideo}
    javaScriptEnabled={true}
    domStorageEnabled={false}
    source={{uri: 'https://www.bilibili.com/video/av' + item.aid }}
  />

  <TouchableOpacity style={styles(this.props.user.colorTheme).listItemFooterButton} onPress={()=>{
    this.setState({fullscreenId:item.aid});
    this.changeScreenOrientation(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
  }}>
    <Text style={[styles(this.props.user.colorTheme).listItemFooterButtonText,fontsStyles(this.props.user.font).textcn]}> Full Screen </Text>
    <Icon name='md-expand' size={14} style={styles(this.props.user.colorTheme).listItemFooterButtonIcon}/>
  </TouchableOpacity>
*/
