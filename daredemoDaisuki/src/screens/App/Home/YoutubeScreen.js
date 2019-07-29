import React from 'react';
import { Text, View, FlatList, Image, RefreshControl, TouchableOpacity, Modal, Linking, Animated } from 'react-native';
import { ActionSheet as NBActionSheet, Fab as NBFab, Toast as NBToast } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';
import { ScreenOrientation } from 'expo';
import { withCollapsible } from 'react-navigation-collapsible';

import { styles, fontsStyles } from '../../../styles/App/Home/youtubeScreenStyles.js';
import { getActivities, getChannels } from '../../../api/youtube.js';
import { filterChanged, reset, init, fetchActivitiesBegin, fetchActivitiesSuccess, fetchActivitiesFailure, fetchChannelsBegin, fetchChannelsSuccess, fetchChannelsFailure, displayWebview } from '../../../actions/youtubeActions.js';
import { fetchImageBeginYoutube, fetchImageSuccessYoutubeScreen, fetchImageFailureYoutube } from '../../../actions/vtuberActions.js';
import altImg from '../../../assets/altImg.jpg';
import LoadingComponent from '../../../assets/loading.js';
import { setPrevScreen } from '../../../actions/globalActions.js';
import Tutorial from './Tutorial.js';
import { collapsibleParams } from './AppHeader.js'
import ImageLoadingComponent from '../../../assets/imageLoading.js';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const mapStateToProps = (state) => {
  const { youtube, user, vtuber, global } = state
  return { youtube, user, vtuber, global }
};

const mapDispatchToProps = dispatch => ({
  filterChanged: (group) => dispatch(filterChanged(group)),
  fetchActivitiesBegin: () => dispatch(fetchActivitiesBegin()),
  fetchActivitiesSuccess: (input) => dispatch(fetchActivitiesSuccess(input)),
  fetchActivitiesFailure: () => dispatch(fetchActivitiesFailure()),
  displayWebview: (title) => dispatch(displayWebview(title)),
  init: () => dispatch(init()),
  reset: () => dispatch(reset()),
  setPrevScreen: (input) => dispatch(setPrevScreen(input)),
  fetchImageBeginYoutube: () => dispatch(fetchImageBeginYoutube()),
  fetchImageSuccessYoutubeScreen: (input) => dispatch(fetchImageSuccessYoutubeScreen(input)),
  fetchImageFailureYoutube: () => dispatch(fetchImageFailureYoutube()),
});

class YoutubeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastTap: null,
      fullscreenId: "",
      //idx: 0, //use top lvl navigator & scrollToIndex if IOS failed
    }
    this.onRefresh = this.onRefresh.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.tabOnPressCallback=this.tabOnPressCallback.bind(this);
    this.headerOnPressCallback=this.headerOnPressCallback.bind(this);
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
    if (this.state.lastTap && (now - this.state.lastTap) < DOUBLE_PRESS_DELAY && this.props.youtube.activities.length > 0) {//if 2 clicks within x sec & length > 0
      this.flatListRef.getNode().scrollToOffset({ animated: true, offset: 0 });//scroll to top
    } else {
      this.setState({lastTap : now});//update last tap time
    }
  }
  tabOnPressCallback(){
    this.flatListRef.getNode().scrollToOffset({ animated: true, offset: 0 });//scroll to top
  }
  componentDidMount(){
    if(willBlurSubscription){
      willBlurSubscription.remove();
    }
    let willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload => {
        this.setState({fullscreenId: ""});
        this.props.setPrevScreen("YoutubeScreen");
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
        },50)
      }
    );
    this.init();
  }
  componentDidUpdate(prevProps){
    if((prevProps.youtube.group !== this.props.youtube.group)){//group changes
      this.props.navigation.setParams({group: this.props.youtube.group });//set header to current screen
    }
  }
  init(){
    this.props.init();//reset props.youtube
    setTimeout(()=>{//allow redux change store
      this.onRefresh();
    },50);
    this.props.navigation.setParams({headerOnPressCallback: this.headerOnPressCallback, tabOnPressCallback: this.tabOnPressCallback,  group: this.props.youtube.group });//set header to current screen
  }
  onRefresh(){
    /*
    Refresh all data
    */
    this.props.reset();//reset props.youtube
    var subscriptions = [];//list of vtuber supposed to be displayed
    var dict = {};
    if(this.props.youtube.group === "Daredemo Daisuki"){//if all vtuber
      this.props.user.subscriptions.forEach((vtuber)=>{
        var youtubeId = this.props.vtuber.vtubersDict[vtuber].youtubeId;
        if(!(youtubeId in dict)){//no repeat and no undefined id
          subscriptions.push(vtuber);
          dict[youtubeId] = 1;
        }
      });
    }else{//if selected group
      this.props.user.groups
      .filter((group)=>group.name===this.props.youtube.group)[0].vtubers
      .forEach((vtuber)=>{
        var youtubeId = this.props.vtuber.vtubersDict[vtuber].youtubeId;
        if(!(youtubeId in dict)){//no repeat and no undefined id
          subscriptions.push(vtuber);
          dict[youtubeId] = 1;
        }
      });
    }
    var missingImages = [];
    subscriptions.forEach((vtuber)=>{//check if missing youtube image
      if(!(this.props.vtuber.vtubersDict[vtuber].youtubeId in this.props.vtuber.youtubeImage)){
        missingImages.push(vtuber);
      }
    })
    setTimeout(()=>{//allow redux change store
      if (this.props.user.googleapikey !== "") {//if user set up api key
        getActivities(subscriptions,this.props.vtuber.vtubersDict, this.props.fetchActivitiesBegin,this.props.fetchActivitiesSuccess, this.props.fetchActivitiesFailure, this.props.youtube.nextPageTokenActivities, this.props.user.googleapikey);
        if(missingImages.length > 0){
          getChannels(subscriptions, this.props.vtuber.vtubersDict, this.props.fetchImageBeginYoutube, this.props.fetchImageSuccessYoutubeScreen,this.props.fetchImageFailureYoutube, {}, this.props.user.googleapikey)
        }
      }else {
        getActivities(subscriptions,this.props.vtuber.vtubersDict, this.props.fetchActivitiesBegin,this.props.fetchActivitiesSuccess, this.props.fetchActivitiesFailure, this.props.youtube.nextPageTokenActivities);
        if(missingImages.length > 0){
          getChannels(subscriptions, this.props.vtuber.vtubersDict, this.props.fetchImageBeginYoutube, this.props.fetchImageSuccessYoutubeScreen,this.props.fetchImageFailureYoutube)
        }
      }
    },0)
  }

  onEndReached(){
    /*
    Get more data
    */
    var subscriptions = [];//list of vtuber supposed to be displayed
    var dict = {};
    if(this.props.youtube.group === "Daredemo Daisuki"){//if all vtuber
      this.props.user.subscriptions.forEach((vtuber)=>{
        var youtubeId = this.props.vtuber.vtubersDict[vtuber].youtubeId;
        if(!(youtubeId in dict)){//no repeat and no undefined id
          subscriptions.push(vtuber);
          dict[youtubeId] = 1;
        }
      });
    }else{//if selected group
      this.props.user.groups
      .filter((group)=>group.name===this.props.youtube.group)[0].vtubers
      .forEach((vtuber)=>{
        var youtubeId = this.props.vtuber.vtubersDict[vtuber].youtubeId;
        if(!(youtubeId in dict)){//no repeat and no undefined id
          subscriptions.push(vtuber);
          dict[youtubeId] = 1;
        }
      });
    }
    var missingImages = [];
    subscriptions.forEach((vtuber)=>{//check if missing youtube image
      if(!(this.props.vtuber.vtubersDict[vtuber].youtubeId in this.props.vtuber.youtubeImage)){
        missingImages.push(vtuber);
      }
    })
    if (this.props.user.googleapikey !== "") {//if user set up api key
      getActivities(subscriptions,this.props.vtuber.vtubersDict, this.props.fetchActivitiesBegin,this.props.fetchActivitiesSuccess, this.props.fetchActivitiesFailure, this.props.youtube.nextPageTokenActivities, this.props.user.googleapikey);
      if(missingImages.length > 0){
        getChannels(subscriptions, this.props.vtuber.vtubersDict, this.props.fetchImageBeginYoutube, this.props.fetchImageSuccessYoutubeScreen,this.props.fetchImageFailureYoutube, {}, this.props.user.googleapikey)
      }
    }else {
      getActivities(subscriptions,this.props.vtuber.vtubersDict, this.props.fetchActivitiesBegin,this.props.fetchActivitiesSuccess, this.props.fetchActivitiesFailure, this.props.youtube.nextPageTokenActivities);
      if(missingImages.length > 0){
        getChannels(subscriptions, this.props.vtuber.vtubersDict, this.props.fetchImageBeginYoutube, this.props.fetchImageSuccessYoutubeScreen,this.props.fetchImageFailureYoutube)
      }
    }
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
    const { paddingHeight, animatedY, onScroll } = this.props.collapsible;
    return (
      <View style={styles(this.props.user.colorTheme).container}>
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
              source={{uri: 'https://www.youtube.com/embed/' + this.state.fullscreenId }}
            />
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.props.youtube.loadingActivities || this.props.youtube.loadingChannels}
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
            <AnimatedFlatList
              ref={r => (this.flatListRef = r)}
              contentContainerStyle={{paddingTop: paddingHeight}}
              scrollIndicatorInsets={{top: paddingHeight}}
              onScroll={onScroll}
              _mustAddThis={animatedY}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={this.onRefresh}
                />
              }
              renderItem={({item, index}) => (
                <View key={index} style={styles(this.props.user.colorTheme).listItem}>
                  <View style={styles(this.props.user.colorTheme).listItemHeader}>
                    <TouchableOpacity onPress={() =>
                      {Linking.openURL("http://www.youtube.com/channel/"+item.channelId).catch((err) => console.error('An error occurred', err))}
                    }
                    style={styles(this.props.user.colorTheme).listItemHeaderImageWrapper}
                    >
                      {
                        this.props.vtuber.youtubeImage[item.channelId]
                        ?
                        <Image
                          style={styles(this.props.user.colorTheme).listItemHeaderImage}
                          source={this.props.vtuber.youtubeImage[item.channelId]
                            ? {uri: this.props.vtuber.youtubeImage[item.channelId]
                            }: altImg}
                        />
                        :
                        <ImageLoadingComponent style={styles(this.props.user.colorTheme).listItemHeaderImage} />
                      }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() =>
                      {Linking.openURL("https://www.youtube.com/watch?v="+item.videoId).catch((err) => console.error('An error occurred', err))}
                      }
                      style={styles(this.props.user.colorTheme).listItemHeaderTextWrapper}
                    >
                      <Text numberOfLines={2} style={[styles(this.props.user.colorTheme).listItemHeaderText,fontsStyles(this.props.user.font).header]}>{item.title}</Text>
                      <Text numberOfLines={1} style={[styles(this.props.user.colorTheme).listItemHeaderSubText,fontsStyles(this.props.user.font).subheader]}>{item.vtubername}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles(this.props.user.colorTheme).listItemContent}>
                    {
                      this.props.youtube.webviews[item.title]
                      ?
                      <WebView
                        style={styles(this.props.user.colorTheme).listItemContentVideo}
                        javaScriptEnabled={true}
                        domStorageEnabled={false}
                        source={{uri: 'https://www.youtube.com/embed/' + item.videoId }}
                      />
                      :
                      <TouchableOpacity onPress={()=>{
                        this.props.displayWebview(item.title);
                      }}>
                        {
                          item.image
                          ?
                          <Image
                            style={styles(this.props.user.colorTheme).listItemContentImage}
                            source={item.image?{uri:item.image}:altImg}
                          />
                          :
                          <ImageLoadingComponent style={styles(this.props.user.colorTheme).listItemContentImage} />
                        }

                      </TouchableOpacity>
                    }
                  </View>
                  <View style={styles(this.props.user.colorTheme).listItemFooter}>
                    <Text style={[styles(this.props.user.colorTheme).listItemFooterText,fontsStyles(this.props.user.font).text]}>{item.displaytime}</Text>
                    <TouchableOpacity style={styles(this.props.user.colorTheme).listItemFooterButton} onPress={()=>{
                      this.setState({fullscreenId:item.videoId});
                      this.changeScreenOrientation(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
                    }}>
                      <Text style={[styles(this.props.user.colorTheme).listItemFooterButtonText,fontsStyles(this.props.user.font).text]}> Full Screen </Text>
                      <Icon name='md-expand' size={14} style={styles(this.props.user.colorTheme).listItemFooterButtonIcon}/>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              data = {this.props.youtube.activities.sort(function(a,b){return b.time - a.time})}
              keyExtractor={(item, index) => item + index}
              ListFooterComponent={
                this.props.youtube.activities.length > 0 && (
                  <TouchableOpacity style={styles(this.props.user.colorTheme).listFooter} onPressed={() => this.onEndReached()}>
                    <Text style={fontsStyles(this.props.user.font).text}>Load More</Text>
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

export default connect(mapStateToProps,mapDispatchToProps)(withCollapsible(YoutubeScreen, collapsibleParams))
