import React from 'react';
import { Text, View, FlatList, Image, RefreshControl, TouchableOpacity, Modal, Linking, Dimensions, WebView } from 'react-native';
import { ActionSheet as NBActionSheet, Fab as NBFab, Toast as NBToast } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Video } from 'expo-av';
import { ScreenOrientation } from 'expo';
import { Col, Row, Grid } from "react-native-easy-grid";
//import { WebView } from 'react-native-webview';

import { styles, fontsStyles } from '../../../styles/App/Home/twitterScreenStyles.js';
import { getTimeline } from  '../../../api/twitter.js';
import altImg from '../../../assets/altImg.jpg';
import { filterChanged, reset, init, fetchTimelineBegin, fetchTimelineSuccess, fetchTimelineFailure } from '../../../actions/twitterActions.js';
import  LoadingComponent  from '../../../assets/loading.js';
import { setPrevScreen } from '../../../actions/globalActions.js';
import Tutorial from './Tutorial.js';

const mapStateToProps = (state) => {
  const {  user, vtuber, twitter, global } = state
  return { user, vtuber, twitter, global }
};

const mapDispatchToProps = dispatch => ({
  filterChanged: (group) => dispatch(filterChanged(group)),
  init: () => dispatch(init()),
  reset: () => dispatch(reset()),
  fetchTimelineBegin: () =>  dispatch(fetchTimelineBegin()),
  fetchTimelineSuccess: (tweets,users,max_ids,minDates) =>  dispatch(fetchTimelineSuccess(tweets,users,max_ids,minDates)),
  fetchTimelineFailure: () =>  dispatch(fetchTimelineFailure()),
  setPrevScreen: (input) => dispatch(setPrevScreen(input)),
});

//TODO ADD truncated subtweet support, click more = query for that tweet
class TwitterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastTap: null,
      fullScreenUrl: "",
      fullSreenType: "",
      displayUrl: "",
    }
    this.tabOnPressCallback=this.tabOnPressCallback.bind(this);
    this.headerOnPressCallback=this.headerOnPressCallback.bind(this);
    this.buildActionSheet = this.buildActionSheet.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.parseTweet = this.parseTweet.bind(this);
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
    if (this.state.lastTap && (now - this.state.lastTap) < DOUBLE_PRESS_DELAY && this.props.twitter.tweets.length > 0) {//if 2 clicks within x sec
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
        this.props.setPrevScreen("TwitterScreen");
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
  componentDidUpdate(prevProps){
    if((prevProps.twitter.group !== this.props.twitter.group)){//group changes
      this.props.navigation.setParams({group: this.props.twitter.group });//set header to current screen
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(
      nextState !== this.state ||
      nextProps.twitter.tweets !== this.props.twitter.tweets ||
      nextProps.twitter.group !== this.props.twitter.group ||
      nextProps.twitter.limit !== this.props.twitter.limit
    ){
      return true;
    }
    return false;
  }
  init(){
    this.props.init();//reset props.twitter
    setTimeout(()=>{//allow redux change store
      this.onRefresh();
    },50);
    this.props.navigation.setParams({headerOnPressCallback: this.headerOnPressCallback, tabOnPressCallback: this.tabOnPressCallback, group: this.props.twitter.group });//set header to current screen
  }
  onRefresh(){
    /*
    Refresh all data
    */
    this.props.reset();//reset props.twitter
    var subscriptions = [];//list of vtuber supposed to be displayed
    var dict = {};
    if(this.props.twitter.group === "Daredemo Daisuki"){//if all vtuber
      this.props.user.subscriptions.forEach((vtuber)=>{
        var twitterId = this.props.vtuber.vtubersDict[vtuber].twitterId;
        if(!(twitterId in dict) && twitterId !== "0"){//no repeat and no undefined id
          subscriptions.push(vtuber);
          dict[twitterId] = 1;
        }
      });
    }else{//if selected group
      this.props.user.groups
      .filter((group)=>group.name===this.props.twitter.group)[0].vtubers
      .forEach((vtuber)=>{
        var twitterId = this.props.vtuber.vtubersDict[vtuber].twitterId;
        if(!(twitterId in dict) && twitterId !== "0"){//no repeat and no undefined id
          subscriptions.push(vtuber);
          dict[twitterId] = 1;
        }
      });
    }
    setTimeout(()=>{//allow redux change store
      getTimeline(subscriptions, this.props.vtuber.vtubersDict, this.props.fetchTimelineBegin, this.props.fetchTimelineSuccess, this.props.fetchTimelineFailure);
    },50)
  }
  onEndReached(){
    /*
    Get more data
    */
    var subscriptions = [];//list of vtuber supposed to be displayed
    var dict = {};
    if(this.props.twitter.group === "Daredemo Daisuki"){//if all vtuber
      this.props.user.subscriptions.forEach((vtuber)=>{
        var twitterId = this.props.vtuber.vtubersDict[vtuber].twitterId;
        if(!(twitterId in dict) && twitterId !== "0"){//no repeat and no undefined id
          subscriptions.push(vtuber);
          dict[twitterId] = 1;
        }
      });
    }else{//if selected group
      this.props.user.groups
      .filter((group)=>group.name===this.props.twitter.group)[0].vtubers
      .forEach((vtuber)=>{
        var twitterId = this.props.vtuber.vtubersDict[vtuber].twitterId;
        if(!(twitterId in dict) && twitterId !== "0"){//no repeat and no undefined id
          subscriptions.push(vtuber);
          dict[twitterId] = 1;
        }
      });
    }
    getTimeline(subscriptions, this.props.vtuber.vtubersDict, this.props.fetchTimelineBegin, this.props.fetchTimelineSuccess, this.props.fetchTimelineFailure,this.props.twitter.max_ids);
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
  parseTweet(data,extendedTweet=false){
    /*
    Parse Tweet enable linking of tags/@
    */
    var ret = [];//<Text/> + <Image/> or <WebView/>
    var text = [];//array of parsed <Text>
    var media = [];//array of media
    let hasVideo = false;//has video = media.photo become preview
    let videoId = "";//if hasVideo, id of youtube video
    let videoMp4 = "";//mp4 video link
    var skipIdxs = {};//index to skip for,of loop
    if(data){//if data valid
      if(data.retweeted_status){//is retweet
        ret = [ (this.parseTweet(data.retweeted_status,true)) ]; //directly show retweet obj.
      }else{//not retweet
        var dict = {}//dict of entities
        if(data.entities.hashtags){//#
          data.entities.hashtags.forEach((tag)=>{
            for(var j = tag.indices[0]; j < tag.indices[1]; j++){
              skipIdxs[j] = 1;
            }
            dict[tag.indices[0]] = {type:"hashtag", text: tag.text, end:tag.indices[1]}//put # in dict
          })
        }
        if(data.entities.urls){//url
          data.entities.urls.forEach((url) => {
            for(var j = url.indices[0]; j < url.indices[1]; j++){
              skipIdxs[j] = 1;
            }
            if(url.display_url.includes("youtu.be/") && data.entities.media && data.entities.media[0] && data.entities.media[0].media_url ){//formal video
              hasVideo = true;
              videoId = url.display_url.replace("youtu.be/","");
              dict[url.indices[0]] = {type:"media", url:url.display_url, mediaType:'video', preview: data.entities.media[0].media_url, media_url:url.display_url, end:url.indices[1]}//put media in dict
            }else if(url.display_url.includes("youtu.be/")){//normal youtube url
              dict[url.indices[0]] = {type:"media", url:url.display_url, mediaType:'youtubeLink', media_url:url.display_url, end:url.indices[1]}//put media in dict
            }else{//useless url
              dict[url.indices[0]] = {type:"url", url:url.expanded_url, end:url.indices[1]}//put urls in dict
            }
          })
        }
        if(data.entities.user_mentions){//@
          data.entities.user_mentions.forEach((user)=>{
            for(var j = user.indices[0]; j < user.indices[1]; j++){
              skipIdxs[j] = 1;
            }
            dict[user.indices[0]] = {type:"mention", name: user.name, screen_name: user.screen_name, end:user.indices[1]}//put @ in dict
          })
        }
        if(data.entities.media){//media
          data.entities.media.forEach((media)=>{
            for(var j = media.indices[0]; j < media.indices[1]; j++){
              skipIdxs[j] = 1;
            }
            dict[media.indices[0]] = {type:"media", url:media.media_url, mediaType:media.type, media_url:media.media_url, end:media.indices[1]}//put media in dict
          })
          data.extended_entities && data.extended_entities.media.forEach((media)=>{//entended overwrite original media
            for(var j = media.indices[0]; j < media.indices[1]; j++){
              skipIdxs[j] = 1;
            }
            if(media.type === 'video'){//if is mp4 video
              obj = media.video_info.variants.filter((v)=>v.content_type === "video/mp4").sort((a,b)=>b.bitrate-a.bitrate);
              videoMp4 = obj && obj[0] ? obj[0].url : "";
              dict[media.indices[0]] = {type:"media", url:media.media_url, mediaType:"videomp4", preview:media.media_url, media_url:videoMp4, end:media.indices[1]}//put media in dict
            }else{
              if(dict[media.indices[0]] && dict[media.indices[0]].mediaType === 'photos'){//if muti-image
                dict[media.indices[0]].data.push({type:"media", url:media.media_url, mediaType:media.type, media_url:media.media_url, end:media.indices[1]});
              }else if(dict[media.indices[0]] && dict[media.indices[0]].media_url !== media.media_url){
                dict[media.indices[0]] = {type:"media", mediaType:'photos', data:[dict[media.indices[0]], {type:"media", url:media.media_url, mediaType:media.type, media_url:media.media_url, end:media.indices[1]}]};
              }else{
                dict[media.indices[0]] = {type:"media", url:media.media_url, mediaType:media.type, media_url:media.media_url, end:media.indices[1]}//put media in dict
              }
            }
          })
        }
        if(data.entities.symbols){//$
          data.entities.symbols.forEach((symbol)=>{
            for(var j = symbol.indices[0]; j < symbol.indices[1]; j++){
              skipIdxs[j] = 1;
            }
            dict[symbol.indices[0]] = {type:"symbols", text:symbol.text, end:symbol.indices[1]}// put $ in dict
          })
        }
        if(data.in_reply_to_screen_name){//if is a reply
          text.push(
            (<Text style={[{color:'grey'},fontsStyles(this.props.user.font).text]} key={data.text + 'reply'}> {"Replying to: "} </Text>)
          );
        }
        var i = 0;
        for (const char of data.text) {//for all char in text
          if(dict[i]){//if char in dict
            let curr = i;
            var entities = dict;
            if(dict[i].type === 'hashtag'){//if is #
              text.push(
                <TouchableOpacity key={i + "hashtag"} onPress={()=>{
                  Linking.openURL("https://twitter.com/hashtag/"+entities[curr].text).catch((err) => console.error('An error occurred', err))
                }}>
                  <Text style={fontsStyles(this.props.user.font).tag}>{"#" + dict[i].text}</Text>
                </TouchableOpacity>);
            }else if(dict[i].type === 'mention'){//if is #
              text.push(
                <TouchableOpacity key={i + "mention"} onPress={()=>{
                  Linking.openURL("https://twitter.com/"+entities[curr].screen_name).catch((err) => console.error('An error occurred', err))
                }}>
                  <Text style={fontsStyles(this.props.user.font).tag}>{"@" + dict[i].screen_name}</Text>
                </TouchableOpacity>);
            }else if(dict[i].type === 'url'){//if is link
              if(!entities[curr].url.includes('twitter.com')){
                text.push(
                  <TouchableOpacity key={i + "url"} onPress={()=>{
                    Linking.openURL(entities[curr].url).catch((err) => console.error('An error occurred', err))
                  }}>
                    <Text style={fontsStyles(this.props.user.font).link}>{dict[i].url}</Text>
                  </TouchableOpacity>);
              }
            }else if(dict[i].type === 'media'){//media
              if(dict[i].mediaType === "video"){//if is video
                if(this.state.displayUrl === entities[curr].media_url){//enlarge a video
                  media.push(
                    <View style={styles(this.props.user.colorTheme).listItemContentWebViewContainer}>
                    <WebView
                      style={styles(this.props.user.colorTheme).listItemContentImage}
                      javaScriptEnabled={true}
                      domStorageEnabled={false}
                      source={{uri: "https://www.youtube.com/embed/" + this.state.displayUrl.replace("youtu.be/","") }}
                    />
                    </View>
                  )
                }else{//video preview
                  media.push(
                    <TouchableOpacity style={styles(this.props.user.colorTheme).listItemContentImageContainer} onPress={()=>{
                      this.setState({displayUrl:entities[curr].media_url});
                    }} key={entities[curr].preview + "preview"}>
                      <Image style={styles(this.props.user.colorTheme).listItemContentImage} source={entities[curr].preview ? {uri: entities[curr].preview} : altImg}/>
                    </TouchableOpacity>
                  )
                }
              }else if(dict[i].mediaType === "videomp4"){//mp4 video
                hasVideo = false;
                media=[(
                  <View style={styles(this.props.user.colorTheme).listItemContentWebViewContainer} key={data.text + 'video container'}>
                    <Video
                      source={{ uri: entities[curr].media_url }}
                      rate={1.0}
                      volume={1.0}
                      isMuted={false}
                      useNativeControls={true}
                      resizeMode="cover"
                      shouldPlay={false}
                      isLooping={false}
                      usePoster={true}
                      posterSource={{uri:entities[curr].preview}}
                      onFullscreenUpdate={({fullscreenUpdate})=>{
                        if(fullscreenUpdate === 0){//on fullscreen
                          this.changeScreenOrientation(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
                        }else if (fullscreenUpdate === 3){//on fullscreen dismiss
                          this.changeScreenOrientation(ScreenOrientation.OrientationLock.PORTRAIT_UP);
                        }
                      }}
                      style={styles(this.props.user.colorTheme).listItemContentVideo}
                    />
                  </View>
                )];
              }else if(!hasVideo && dict[i].mediaType === "photo"){//if is image
                media.push(
                  <TouchableOpacity style={styles(this.props.user.colorTheme).listItemContentImageContainer} onPress={()=>{
                    this.setState({fullScreenUrl: entities[curr].media_url,fullSreenType:"image"});
                  }} key={entities[curr].media_url + "photo"}>
                    <Image style={styles(this.props.user.colorTheme).listItemContentImage} source={entities[curr].media_url ? {uri: entities[curr].media_url} : altImg}/>
                  </TouchableOpacity>
              )}else if(!hasVideo && dict[i].mediaType === "photos") {
                let uris = entities[curr].data.map(data => {return {url: data.media_url}});
                switch (true) {
                  case (uris.length <= 2)://o oo
                    var imagestyle = styles(this.props.user.colorTheme).listItemContentImage;
                    break;
                  case (uris.length <= 4): //oo;oo
                    var imagestyle = styles(this.props.user.colorTheme).listItemContentImage2;
                    break;
                  case (uris.length <= 9)://ooo;ooo;ooo
                    var imagestyle = styles(this.props.user.colorTheme).listItemContentImage3;
                    break;
                  default:
                    var imagestyle = styles(this.props.user.colorTheme).listItemContentImage;
                    break;
                }
                entities[curr].data.forEach(val=>{
                  media.push(
                    <TouchableOpacity style={styles(this.props.user.colorTheme).listItemContentImageContainer} onPress={()=>{
                      this.setState({fullScreenUrl: uris,fullSreenType:"images"});
                    }} key={val.media_url + "photos"}>
                      <Image style={ imagestyle } source={val.media_url ? {uri: val.media_url} : altImg}/>
                    </TouchableOpacity>
                );
              });
              }else if(dict[i].mediaType === "youtubeLink"){//youtube link
                media.push(
                  <TouchableOpacity key={i + "mention"} onPress={()=>{
                    Linking.openURL("https://www.youtube.com/watch?v="+ entities[curr].media_url.replace("youtu.be/","")).catch((err) => console.error('An error occurred', err))
                  }}>
                    <Text style={[styles(this.props.user.colorTheme).listItemContentLink,fontsStyles(this.props.user.font).link]}>{dict[i].media_url}</Text>
                  </TouchableOpacity>);
              }else{//if is gif
                //TODO: Android gif support
              }
            }
          }else{//normal char
            !skipIdxs[i] && text.push(<Text key={i} style={fontsStyles(this.props.user.font).text} numberOfLines={1}>{char}</Text>);
          }
          i++;
        }
        ret.push(
          <View style={styles(this.props.user.colorTheme).listItemContentText} key={data.text + "textview"}>
          {text}
          </View>
        );//Finished <Text/> part
        switch (media.length) {
          case 1://o oo
            var medias = media;
            break;
          case 2://o oo
            var medias = (
              <Grid>
                <Col>
                    {media[0]}
                </Col>
                <Col style={styles(this.props.user.colorTheme).listItemContentImageColBreak}/>
                <Col>
                    {media[1]}
                </Col>
              </Grid>
            )
            break;
          case 3: //oo;oo
            var medias = (
              <Grid>
                <Col>
                  {media[0]}
                </Col>
                <Col style={styles(this.props.user.colorTheme).listItemContentImageColBreak}/>
                <Col>
                  <Row>
                      {media[1]}
                  </Row>
                  <Row style={styles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[2]}
                  </Row>
                </Col>
              </Grid>
            )
            break;
          case 4: //oo;oo
            var medias = (
              <Grid>
                <Col>
                  <Row>
                      {media[0]}
                  </Row>
                  <Row style={styles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[1]}
                  </Row>
                </Col>
                <Col style={styles(this.props.user.colorTheme).listItemContentImageColBreak}/>
                <Col>
                  <Row>
                      {media[2]}
                  </Row>
                  <Row style={styles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[3]}
                  </Row>
                </Col>
              </Grid>
            )
            break;
          case 5://ooo;ooo;ooo
          var medias = (
              <Grid>
                <Col>
                  <Row>
                      {media[0]}
                  </Row>
                  <Row style={styles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[1]}
                  </Row>
                  <Row style={styles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[2]}
                  </Row>
                </Col>
                <Col style={styles(this.props.user.colorTheme).listItemContentImageColBreak}/>
                <Col>
                  <Row>
                      {media[3]}
                  </Row>
                  <Row style={styles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[4]}
                  </Row>
                </Col>
              </Grid>
            )
            break;
          case 6://ooo;ooo;ooo
            var medias = (
              <Grid>
                <Col>
                  <Row>
                      {media[0]}
                  </Row>
                  <Row style={styles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[1]}
                  </Row>
                  <Row style={styles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[2]}
                  </Row>
                </Col>
                <Col style={styles(this.props.user.colorTheme).listItemContentImageColBreak}/>
                <Col>
                  <Row>
                      {media[3]}
                  </Row>
                  <Row style={styles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[4]}
                  </Row>
                  <Row style={styles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[5]}
                  </Row>
                </Col>
              </Grid>
            )
            break;
          case 7://ooo;ooo;ooo
          var medias = (
              <Grid>
                <Col>
                  <Row>
                      {media[0]}
                  </Row>
                  <Row style={styles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[1]}
                  </Row>
                  <Row style={styles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[2]}
                  </Row>
                </Col>
                <Col style={styles(this.props.user.colorTheme).listItemContentImageColBreak}/>
                <Col>
                  <Row>
                      {media[3]}
                  </Row>
                  <Row style={styles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[4]}
                  </Row>
                  <Row style={styles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[5]}
                  </Row>
                </Col>
                <Col style={styles(this.props.user.colorTheme).listItemContentImageColBreak}/>
                <Col>
                    {media[6]}
                </Col>
              </Grid>
            )
            break;
          case 8://ooo;ooo;ooo
            var medias = (
              <Grid>
                <Col>
                  <Row>
                      {media[0]}
                  </Row>
                  <Row style={styles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[1]}
                  </Row>
                  <Row style={styles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[2]}
                  </Row>
                </Col>
                <Col style={styles(this.props.user.colorTheme).listItemContentImageColBreak}/>
                <Col>
                  <Row>
                      {media[3]}
                  </Row>
                  <Row style={styles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[4]}
                  </Row>
                  <Row style={styles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[5]}
                  </Row>
                </Col>
                <Col style={styles(this.props.user.colorTheme).listItemContentImageColBreak}/>
                <Col>
                  <Row>
                      {media[6]}
                  </Row>
                  <Row style={styles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[7]}
                  </Row>
                </Col>
              </Grid>
            )
            break;
          case 9://ooo;ooo;ooo
            var medias = (
              <Grid>
                <Col>
                  <Row>
                      {media[0]}
                  </Row>
                  <Row style={styles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[1]}
                  </Row>
                  <Row style={styles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[2]}
                  </Row>
                </Col>
                <Col style={styles(this.props.user.colorTheme).listItemContentImageColBreak}/>
                <Col>
                  <Row>
                      {media[3]}
                  </Row>
                  <Row style={styles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[4]}
                  </Row>
                  <Row style={styles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[5]}
                  </Row>
                </Col>
                <Col style={styles(this.props.user.colorTheme).listItemContentImageColBreak}/>
                <Col>
                  <Row>
                      {media[6]}
                  </Row>
                  <Row style={styles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[7]}
                  </Row>
                  <Row style={styles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[8]}
                  </Row>
                </Col>
              </Grid>
            )
            break;
          default:
            var medias = media;
            break;
        }
        if(media.length > 0){
          ret.push(
            <View style={styles(this.props.user.colorTheme).listItemContentMedia} key={data.text + "medias"}>
            {medias}
            </View>
          )
        }
        if(data.quoted_status){//if have quoted
          ret.push(this.parseTweet(data.quoted_status,true));//continue parse quote
        }
        if(data.extended_tweet){//if have extended_tweet
          if(data.truncated){//if truncated
            return this.parseTweet(data.extended_tweet);//use truncated extended_tweet not this tweet
          }
        }
      }
      var date = new Date(data.created_at);
      return (
        <View style={
          extendedTweet?
          styles(this.props.user.colorTheme).listItemExtendedTweet:
          styles(this.props.user.colorTheme).listItem }
          key={data.text + "wrapper"}>
          <View style={styles(this.props.user.colorTheme).listItemHeader}>

            <TouchableOpacity
              style={styles(this.props.user.colorTheme).listItemHeaderImageWrapper}
              onPress={() =>
                {Linking.openURL("https://twitter.com/"+data.user.screen_name).catch((err) => console.error('An error occurred', err))}
            }>
              <Image
                style={styles(this.props.user.colorTheme).listItemHeaderImage}
                source={data.user.profile_image_url.replace('_normal',"_bigger") ?{uri: data.user.profile_image_url.replace('_normal',"_bigger") }: altImg}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles(this.props.user.colorTheme).listItemHeaderTextWrapper}
              onPress={() =>
                {Linking.openURL("https://twitter.com/"+data.user.screen_name).catch((err) => console.error('An error occurred', err))}
            }>
              <Text style={[styles(this.props.user.colorTheme).listItemHeaderText,fontsStyles(this.props.user.font).header]} numberOfLines={2}>{data.user.name}</Text>
              <Text style={[styles(this.props.user.colorTheme).listItemHeaderSubText,fontsStyles(this.props.user.font).subheader]} numberOfLines={1}>{ '@' + data.user.screen_name}</Text>
            </TouchableOpacity>

          </View>

          <View style={styles(this.props.user.colorTheme).listItemContent}>
              { ret }
          </View>

          <View style={styles(this.props.user.colorTheme).listItemFooter}>
            {
              !extendedTweet && (
              <Text style={[styles(this.props.user.colorTheme).listItemFooterText, fontsStyles(this.props.user.font).text]}>
              {
                date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate())  + ' ' +  (date.getHours().toString().length === 1?"0"+date.getHours().toString():date.getHours().toString()) + ':' + (date.getMinutes().toString().length === 1?"0"+date.getMinutes().toString():date.getMinutes().toString())
              }
              </Text> )
            }
            {
              hasVideo && videoId !== "" &&
              <TouchableOpacity style={styles(this.props.user.colorTheme).listItemFooterButton} onPress={()=>{
                this.setState({fullScreenUrl: videoMp4 !== ""?videoMp4:'https://www.youtube.com/embed/' + videoId, fullSreenType:"video"});
                this.changeScreenOrientation(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
              }}>
                <Text style={[styles(this.props.user.colorTheme).listItemFooterText,fontsStyles(this.props.user.font).text]}> Full Screen </Text>
                <Icon name='md-expand' size={14} style={styles(this.props.user.colorTheme).listItemFooterIcon}/>
              </TouchableOpacity>
            }
          </View>
        </View>
      );
    }

  }
  render() {
    var {height, width} = Dimensions.get('window');
    var maxMinDates = new Date("July 1, 1970");
    let oldDate = new Date("July 1, 1970");;
    for (const [ key, value ] of Object.entries(this.props.twitter.minDates)) {
        if (value > maxMinDates && value !== oldDate){//if tweet length reach end, not count it.
          maxMinDates = value;
        }
    }
    return (
      <View style={styles(this.props.user.colorTheme).container}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.fullScreenUrl!==""}
          onRequestClose={() => { this.setState({fullScreenUrl: ""}); this.changeScreenOrientation(ScreenOrientation.OrientationLock.PORTRAIT_UP);}}
          onDismiss={() => { this.setState({fullScreenUrl: ""}); this.changeScreenOrientation(ScreenOrientation.OrientationLock.PORTRAIT_UP);}}
          >
          <View style={styles(this.props.user.colorTheme).fullscreenContainer}>
            {
              this.state.fullSreenType === "image"
              ?
              <ImageViewer imageUrls={[
                {url:this.state.fullScreenUrl}
              ]}/>
              :
              (
                this.state.fullSreenType === "images"
                ?
                <ImageViewer imageUrls={this.state.fullScreenUrl}/>
                :
                <WebView
                  style={styles(this.props.user.colorTheme).fullscreen}
                  scalesPageToFit={true}
                  javaScriptEnabled={true}
                  domStorageEnabled={false}
                  source={{uri: this.state.fullScreenUrl }}
                />
              )
            }
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.props.twitter.loading}
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
              renderItem={({item, index}) => {
                  return (
                    <View key={index}>
                      {this.parseTweet(item)}
                    </View>
                  )
                }
              }
              data = {
                  this.props.twitter.tweets
                  .filter(tweet=>new Date(tweet.created_at) >= maxMinDates)
                  .sort((a,b)=>{
                    return new Date(b.created_at) - new Date(a.created_at);
                  })
              }
              keyExtractor={(item, index) => item + index}

              ListFooterComponent={
                this.props.twitter.tweets.length > 0 && (
                  <TouchableOpacity style={styles(this.props.user.colorTheme).listFooter} onPress={()=>{this.onEndReached()}}>
                    <Text style={fontsStyles(this.props.user.font).text}>Load More</Text>
                  </TouchableOpacity>
                )
              }
              onEndReached={()=>{this.onEndReached()}}
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

export default connect(mapStateToProps,mapDispatchToProps)(TwitterScreen)
