import React from 'react';
import { Text, View, TouchableOpacity, FlatList, Linking, Image, Modal, Dimensions, RefreshControl } from 'react-native';
import { Badge as NBBadge, Container as NBContainer, Text as NBText, Tab as NBTab, Tabs as NBTabs, TabHeading as NBTabHeading, ScrollableTab as NBScrollableTab, Content as NBContent, ListItem as NBListItem, Left as NBLeft, Right as NBRight, Body as NBBody, Thumbnail as NBThumbnail, Spinner as NBSpinner, Button as NBButton, Toast as NBToast } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Video } from 'expo-av';
import { WebView } from 'react-native-webview';
import { ScreenOrientation } from 'expo';
import { Col, Row, Grid } from "react-native-easy-grid";

import { styles, fontsStyles, youtubeStyles, biliStyles, twitterStyles, themeColor } from '../../styles/App/searchScreenStyles.js';
import { fetchImageBeginYoutube, fetchImageSuccessYoutube, fetchImageFailureYoutube, fetchImageBeginTwitter, fetchImageSuccessTwitter, fetchImageFailureTwitter, fetchImageBeginBili, fetchImageSuccessBili, fetchImageFailureBili, fetchVtubersBegin, fetchVtubersSuccess, fetchVtubersFailure } from '../../actions/vtuberActions.js';
import { putSubscriptionsBegin, putSubscriptionsSuccess, putSubscriptionsFailure } from '../../actions/userActions.js';
import { searchTab, searchVtuberRemove, fetchVtuberBegin, fetchVtuberSuccess, fetchVtuberFailure, fetchYoutubeBegin, fetchYoutubeSuccess, fetchYoutubeFailure, fetchTwitterBegin, fetchTwitterSuccess, fetchTwitterFailure, fetchbiliBegin, fetchbiliSuccess, fetchbiliFailure, searchTwitterEndReached, resetData } from '../../actions/searchActions.js';
import { searchVideo, getChannelsIDs } from '../../api/youtube.js';
import { getUsers, query } from '../../api/twitter.js';
import { getAccountById, queryVideo } from '../../api/bilibili.js';
import { putSubscriptions } from '../../api/express.js';
import { getAll, getAllVtubers, queryVtubers } from '../../api/vtubers.js';
import altImg from '../../assets/altImg.jpg';
import  LoadingComponent  from '../../assets/loading.js';
import { setPrevScreen } from '../../actions/globalActions.js';
import { imageFetch } from '../../api/custom.js';
import ImageLoadingComponent from '../../assets/imageLoading.js';

const mapStateToProps = (state) => {
  const { search, vtuber, youtube, user } = state
  return { search, vtuber, youtube, user }
};

const mapDispatchToProps = dispatch => ({
  searchTab: (value) => dispatch(searchTab(value)),
  fetchVtuberBegin: () => dispatch(fetchVtuberBegin()),
  fetchVtuberSuccess: (input) => dispatch(fetchVtuberSuccess(input)),
  fetchVtuberFailure: () => dispatch(fetchVtuberFailure()),
  fetchVtubersBegin: () => dispatch(fetchVtubersBegin()),
  fetchVtubersSuccess: (input) => dispatch(fetchVtubersSuccess(input)),
  fetchVtubersFailure: () => dispatch(fetchVtubersFailure()),
  fetchYoutubeBegin: () => dispatch(fetchYoutubeBegin()),
  fetchYoutubeSuccess: (input) => dispatch(fetchYoutubeSuccess(input)),
  fetchYoutubeFailure: () => dispatch(fetchYoutubeFailure()),
  fetchTwitterBegin: () => dispatch(fetchTwitterBegin()),
  fetchTwitterSuccess: (input) => dispatch(fetchTwitterSuccess(input)),
  fetchTwitterFailure: () => dispatch(fetchTwitterFailure()),
  fetchImageBeginYoutube: () => dispatch(fetchImageBeginYoutube()),
  fetchImageSuccessYoutube: (input) => dispatch(fetchImageSuccessYoutube(input)),
  fetchImageFailureYoutube: () => dispatch(fetchImageFailureYoutube()),
  fetchImageBeginTwitter: () => dispatch(fetchImageBeginTwitter()),
  fetchImageSuccessTwitter: (input) => dispatch(fetchImageSuccessTwitter(input)),
  fetchImageFailureTwitter: () => dispatch(fetchImageFailureTwitter()),
  fetchImageBeginBili: () => dispatch(fetchImageBeginBili()),
  fetchImageSuccessBili: (input) => dispatch(fetchImageSuccessBili(input)),
  fetchImageFailureBili: () => dispatch(fetchImageFailureBili()),
  fetchbiliBegin: () => dispatch(fetchbiliBegin()),
  fetchbiliSuccess: (input) => dispatch(fetchbiliSuccess(input)),
  fetchbiliFailure: () => dispatch(fetchbiliFailure()),
  resetData: () => dispatch(resetData()),
  putSubscriptionsBegin: (enname) => dispatch(putSubscriptionsBegin(enname)),
  putSubscriptionsSuccess: (subscriptions,enname) => dispatch(putSubscriptionsSuccess(subscriptions,enname)),
  putSubscriptionsFailure: (enname) => dispatch(putSubscriptionsFailure(enname)),
  searchVtuberRemove: (enname) => dispatch(searchVtuberRemove(enname)),
  searchTwitterEndReached: () => dispatch(searchTwitterEndReached()),
  setPrevScreen: (input) => dispatch(setPrevScreen(input)),
});

//bug: API KEY ERROR when youtube on end reach
//TODO: search next when more than 100
class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rand: new Date().getSeconds()/60,//rng based on time
      fullscreenIdYoutube: "",
      webviewsYoutube: {},
      fullScreenUrl: "",
      fullScreenUrlTwitter: "",
      fullSreenTypeTwitter: "",
      displayUrlTwitter: "",
    }
    this.parseTweet = this.parseTweet.bind(this);
    this.changeScreenOrientation = this.changeScreenOrientation.bind(this);
  }
  async changeScreenOrientation(ori) {
    await ScreenOrientation.lockAsync(ori);
  }
  componentDidMount(){
    if(willBlurSubscription){
      willBlurSubscription.remove();
    }
    let willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload => {
        this.props.setPrevScreen("SearchScreen");
      }
    );
    this.props.resetData();//reset props.search
    setTimeout(()=>{//allow redux change store
      getAll(this.props.fetchVtuberBegin,this.props.fetchVtuberSuccess,this.props.fetchVtuberFailure,this.props.user.subscriptions,this.props.search.pageVtuber);
    }
    ,50)
  }
  componentDidUpdate(prevProps){
    if(prevProps.search.tab !== 0 && this.props.search.tab === 0){//From other tab to vtuber tab
      this.props.resetData();//reset props.serach
      setTimeout(()=>{//allow redux change store
        getAll(this.props.fetchVtuberBegin,this.props.fetchVtuberSuccess,this.props.fetchVtuberFailure,this.props.user.subscriptions,this.props.search.pageVtuber);//call get list of vtuber api
      }
      ,50)
    }else if(prevProps.search.loadingVtuber && !this.props.search.loadingVtuber){//done loading vtuber
      var missingImage = this.props.search.vtubersData
      .filter((vtuber)=>{return !this.props.vtuber.vtubersImage[vtuber.enname]})//vtuber not subscribed by user = not fetch initially
      imageFetch(missingImage,getChannelsIDs,getUsers, getAccountById,this.props.fetchImageBeginYoutube,this.props.fetchImageSuccessYoutube,this.props.fetchImageFailureYoutube,this.props.fetchImageBeginTwitter,this.props.fetchImageSuccessTwitter,this.props.fetchImageFailureTwitter,this.props.fetchImageBeginBili,this.props.fetchImageSuccessBili,this.props.fetchImageFailureBili,this.props.user.googleapikey,this.props.user.twitterapikey);
    }else if(prevProps.search.loadingYoutube && !this.props.search.loadingYoutube && this.props.search.youtubeData === []){//finish loading youtube but no result
      NBToast.show({
        text: 'API Key Error',
        duration: 2000,
      })
    }else if(prevProps.vtuber.fetchFailure !== this.props.vtuber.fetchFailure){//failed to load vtuber image
      NBToast.show({
        text: 'API Key Error',
        duration: 2000,
      })
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
                if(this.state.displayUrlTwitter === entities[curr].media_url){//enlarge a video
                  media.push(
                    <View style={twitterStyles(this.props.user.colorTheme).listItemContentWebViewContainer}>
                    <WebView
                      style={twitterStyles(this.props.user.colorTheme).listItemContentImage}
                      javaScriptEnabled={true}
                      domStorageEnabled={false}
                      source={{uri: "https://www.youtube.com/embed/" + this.state.displayUrlTwitter.replace("youtu.be/","") }}
                    />
                    </View>
                  )
                }else{//video preview
                  media.push(
                    <TouchableOpacity style={twitterStyles(this.props.user.colorTheme).listItemContentImageContainer} onPress={()=>{
                      this.setState({displayUrlTwitter:entities[curr].media_url});
                    }} key={entities[curr].preview + "preview"}>
                      <Image style={twitterStyles(this.props.user.colorTheme).listItemContentImage} source={entities[curr].preview ? {uri: entities[curr].preview} : altImg}/>
                    </TouchableOpacity>
                  )
                }
              }else if(dict[i].mediaType === "videomp4"){//mp4 video
                hasVideo = false;
                media=[(
                  <View style={twitterStyles(this.props.user.colorTheme).listItemContentWebViewContainer} key={data.text + 'video container'}>
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
                      style={twitterStyles(this.props.user.colorTheme).listItemContentVideo}
                    />
                  </View>
                )];
              }else if(!hasVideo && dict[i].mediaType === "photo"){//if is image
                media.push(
                  <TouchableOpacity style={twitterStyles(this.props.user.colorTheme).listItemContentImageContainer} onPress={()=>{
                    this.setState({fullScreenUrlTwitter: entities[curr].media_url,fullSreenTypeTwitter:"image"});
                  }} key={entities[curr].media_url + "photo"}>
                    <Image style={twitterStyles(this.props.user.colorTheme).listItemContentImage} source={entities[curr].media_url ? {uri: entities[curr].media_url} : altImg}/>
                  </TouchableOpacity>
              )}else if(!hasVideo && dict[i].mediaType === "photos") {
                let uris = entities[curr].data.map(data => {return {url: data.media_url}});
                switch (true) {
                  case (uris.length <= 2)://o oo
                    var imagestyle = twitterStyles(this.props.user.colorTheme).listItemContentImage;
                    break;
                  case (uris.length <= 4): //oo;oo
                    var imagestyle = twitterStyles(this.props.user.colorTheme).listItemContentImage2;
                    break;
                  case (uris.length <= 9)://ooo;ooo;ooo
                    var imagestyle = twitterStyles(this.props.user.colorTheme).listItemContentImage3;
                    break;
                  default:
                    var imagestyle = twitterStyles(this.props.user.colorTheme).listItemContentImage;
                    break;
                }
                entities[curr].data.forEach(val=>{
                  media.push(
                    <TouchableOpacity style={twitterStyles(this.props.user.colorTheme).listItemContentImageContainer} onPress={()=>{
                      this.setState({fullScreenUrlTwitter: uris,fullSreenTypeTwitter:"images"});
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
                    <Text style={[twitterStyles(this.props.user.colorTheme).listItemContentLink,fontsStyles(this.props.user.font).link]}>{dict[i].media_url}</Text>
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
          <View style={twitterStyles(this.props.user.colorTheme).listItemContentText} key={data.text + "textview"}>
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
                <Col style={twitterStyles(this.props.user.colorTheme).listItemContentImageColBreak}/>
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
                <Col style={twitterStyles(this.props.user.colorTheme).listItemContentImageColBreak}/>
                <Col>
                  <Row>
                      {media[1]}
                  </Row>
                  <Row style={twitterStyles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
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
                  <Row style={twitterStyles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[1]}
                  </Row>
                </Col>
                <Col style={twitterStyles(this.props.user.colorTheme).listItemContentImageColBreak}/>
                <Col>
                  <Row>
                      {media[2]}
                  </Row>
                  <Row style={twitterStyles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
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
                  <Row style={twitterStyles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[1]}
                  </Row>
                  <Row style={twitterStyles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[2]}
                  </Row>
                </Col>
                <Col style={twitterStyles(this.props.user.colorTheme).listItemContentImageColBreak}/>
                <Col>
                  <Row>
                      {media[3]}
                  </Row>
                  <Row style={twitterStyles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
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
                  <Row style={twitterStyles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[1]}
                  </Row>
                  <Row style={twitterStyles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[2]}
                  </Row>
                </Col>
                <Col style={twitterStyles(this.props.user.colorTheme).listItemContentImageColBreak}/>
                <Col>
                  <Row>
                      {media[3]}
                  </Row>
                  <Row style={twitterStyles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[4]}
                  </Row>
                  <Row style={twitterStyles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
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
                  <Row style={twitterStyles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[1]}
                  </Row>
                  <Row style={twitterStyles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[2]}
                  </Row>
                </Col>
                <Col style={twitterStyles(this.props.user.colorTheme).listItemContentImageColBreak}/>
                <Col>
                  <Row>
                      {media[3]}
                  </Row>
                  <Row style={twitterStyles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[4]}
                  </Row>
                  <Row style={twitterStyles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[5]}
                  </Row>
                </Col>
                <Col style={twitterStyles(this.props.user.colorTheme).listItemContentImageColBreak}/>
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
                  <Row style={twitterStyles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[1]}
                  </Row>
                  <Row style={twitterStyles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[2]}
                  </Row>
                </Col>
                <Col style={twitterStyles(this.props.user.colorTheme).listItemContentImageColBreak}/>
                <Col>
                  <Row>
                      {media[3]}
                  </Row>
                  <Row style={twitterStyles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[4]}
                  </Row>
                  <Row style={twitterStyles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[5]}
                  </Row>
                </Col>
                <Col style={twitterStyles(this.props.user.colorTheme).listItemContentImageColBreak}/>
                <Col>
                  <Row>
                      {media[6]}
                  </Row>
                  <Row style={twitterStyles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
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
                  <Row style={twitterStyles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[1]}
                  </Row>
                  <Row style={twitterStyles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[2]}
                  </Row>
                </Col>
                <Col style={twitterStyles(this.props.user.colorTheme).listItemContentImageColBreak}/>
                <Col>
                  <Row>
                      {media[3]}
                  </Row>
                  <Row style={twitterStyles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[4]}
                  </Row>
                  <Row style={twitterStyles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[5]}
                  </Row>
                </Col>
                <Col style={twitterStyles(this.props.user.colorTheme).listItemContentImageColBreak}/>
                <Col>
                  <Row>
                      {media[6]}
                  </Row>
                  <Row style={twitterStyles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
                  <Row>
                      {media[7]}
                  </Row>
                  <Row style={twitterStyles(this.props.user.colorTheme).listItemContentImageRowBreak}/>
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
            <View style={twitterStyles(this.props.user.colorTheme).listItemContentMedia} key={data.text + "medias"}>
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
          twitterStyles(this.props.user.colorTheme).listItemExtendedTweet:
          twitterStyles(this.props.user.colorTheme).listItem }
          key={data.text + "wrapper"}>
          <View style={twitterStyles(this.props.user.colorTheme).listItemHeader}>

            <TouchableOpacity
              style={twitterStyles(this.props.user.colorTheme).listItemHeaderImageWrapper}
              onPress={() =>
                {Linking.openURL("https://twitter.com/"+data.user.screen_name).catch((err) => console.error('An error occurred', err))}
            }>
              <Image
                style={twitterStyles(this.props.user.colorTheme).listItemHeaderImage}
                source={data.user.profile_image_url.replace('_normal',"_bigger") ?{uri: data.user.profile_image_url.replace('_normal',"_bigger") }: altImg}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={twitterStyles(this.props.user.colorTheme).listItemHeaderTextWrapper}
              onPress={() =>
                {Linking.openURL("https://twitter.com/"+data.user.screen_name).catch((err) => console.error('An error occurred', err))}
            }>
              <Text style={[twitterStyles(this.props.user.colorTheme).listItemHeaderText,fontsStyles(this.props.user.font).header]} numberOfLines={2}>{data.user.name}</Text>
              <Text style={[twitterStyles(this.props.user.colorTheme).listItemHeaderSubText,fontsStyles(this.props.user.font).subheader]} numberOfLines={1}>{ '@' + data.user.screen_name}</Text>
            </TouchableOpacity>

          </View>

          <View style={twitterStyles(this.props.user.colorTheme).listItemContent}>
              { ret }
          </View>

          <View style={twitterStyles(this.props.user.colorTheme).listItemFooter}>
            {
              !extendedTweet && (
              <Text style={[twitterStyles(this.props.user.colorTheme).listItemFooterText, fontsStyles(this.props.user.font).text]}>
              {
                date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate())  + ' ' +  (date.getHours().toString().length === 1?"0"+date.getHours().toString():date.getHours().toString()) + ':' + (date.getMinutes().toString().length === 1?"0"+date.getMinutes().toString():date.getMinutes().toString())
              }
              </Text> )
            }
            {
              hasVideo && videoId !== "" &&
              <TouchableOpacity style={twitterStyles(this.props.user.colorTheme).listItemFooterButton} onPress={()=>{
                this.setState({fullScreenUrlTwitter: videoMp4 !== ""?videoMp4:'https://www.youtube.com/embed/' + videoId, fullSreenTypeTwitter:"video"});
                this.changeScreenOrientation(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
              }}>
                <Text style={[twitterStyles(this.props.user.colorTheme).listItemFooterText,fontsStyles(this.props.user.font).text]}> Full Screen </Text>
                <Icon name='md-expand' size={14} style={twitterStyles(this.props.user.colorTheme).listItemFooterIcon}/>
              </TouchableOpacity>
            }
          </View>
        </View>
      );
    }
  }
  render() {
    var loading =
    (
      (this.props.search.tab===0&&(this.props.search.loadingVtuber||this.props.vtuber.loadingImage||Object.values(this.props.user.subscriptionsLoading).includes(true)))
      ||
      (this.props.search.tab===1&&this.props.search.loadingYoutube)
      ||
      (this.props.search.tab===2&&this.props.search.loadingBili)
      ||
      (this.props.search.tab===3&&this.props.search.loadingTwitter)
    )
    var {height, width} = Dimensions.get('window');
    return (
      <NBContainer>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.fullscreenIdYoutube!==""}
          onRequestClose={() => {
            this.changeScreenOrientation(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            this.setState({fullscreenIdYoutube: ""});
          }}
          onDismiss={() => {
            this.changeScreenOrientation(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            this.setState({fullscreenIdYoutube: ""});
          }}
          >
          <View style={youtubeStyles(this.props.user.colorTheme).fullscreenContainer}>
            <WebView
              style={youtubeStyles(this.props.user.colorTheme).fullscreen}
              javaScriptEnabled={true}
              domStorageEnabled={false}
              source={{uri: 'https://www.youtube.com/embed/' + this.state.fullscreenIdYoutube }}
            />
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.fullScreenUrlTwitter!==""}
          onRequestClose={() => { this.setState({fullScreenUrlTwitter: ""}); this.changeScreenOrientation(ScreenOrientation.OrientationLock.PORTRAIT_UP);}}
          onDismiss={() => { this.setState({fullScreenUrlTwitter: ""}); this.changeScreenOrientation(ScreenOrientation.OrientationLock.PORTRAIT_UP);}}
          >
          <View style={twitterStyles(this.props.user.colorTheme).fullscreenContainer}>
            {
              this.state.fullSreenTypeTwitter === "image"
              ?
              <ImageViewer imageUrls={[
                {url:this.state.fullScreenUrlTwitter}
              ]}/>
              :
              (
                this.state.fullSreenTypeTwitter === "images"
                ?
                <ImageViewer imageUrls={this.state.fullScreenUrlTwitter}/>
                :
                <WebView
                  style={twitterStyles(this.props.user.colorTheme).fullscreen}
                  scalesPageToFit={true}
                  javaScriptEnabled={true}
                  domStorageEnabled={false}
                  source={{uri: this.state.fullScreenUrlTwitter }}
                />
              )
            }
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={loading}
          onRequestClose={() => {
          }}>
          <View style={styles(this.props.user.colorTheme).modalContainer}><LoadingComponent duration={1000}/></View>
        </Modal>
        <NBTabs style={styles(this.props.user.colorTheme).tabs} renderTabBar={()=> <NBScrollableTab />} onChangeTab={({i}) => {this.props.searchTab(i)}}>
          <NBTab heading={
            <NBTabHeading style={this.props.search.tab === 0?styles(this.props.user.colorTheme).tabActive:styles(this.props.user.colorTheme).tab}>
              <Icon color={this.props.search.tab === 0?themeColor('red'):themeColor('black')} name="md-heart"/>
              <Text style={this.props.search.tab===0?[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).tabText,{color:themeColor('red')}]:[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).tabText]}>Vtubers</Text>
            </NBTabHeading>}
          >
            <FlatList
            initialNumToRender={20}
            data={this.props.search.vtubersData}
            renderItem={({item, index}) =>
            <NBListItem avatar key={index}>
              <NBLeft>
                {
                  this.props.vtuber.vtubersImage[item.enname]
                  ?
                  <NBThumbnail source={this.props.vtuber.vtubersImage[item.enname]
                    ?{ uri: this.props.vtuber.vtubersImage[item.enname]
                    }:altImg} />
                  :
                  <ImageLoadingComponent/>
                }

              </NBLeft>
              <NBBody style={styles(this.props.user.colorTheme).listItemWrapper}>
                <View>
                  <NBText style={fontsStyles(this.props.user.font).header}>{ item.name }</NBText>
                  <NBText note style={fontsStyles(this.props.user.font).subheader}>{ item.enname }</NBText>
                  <View style={styles(this.props.user.colorTheme).tags}>
                  {
                    item.tags.length > 5
                    ?
                    item.tags.sort(() => 0.5 - this.state.rand).slice(0, 5).map((tag) => {//ramdom 10 tags
                      return (<NBBadge key={tag} style={styles(this.props.user.colorTheme).badge}>
                        <NBText style={[fontsStyles(this.props.user.font).text,styles(this.props.user.colorTheme).badgeText]}>
                          {tag}
                        </NBText>
                      </NBBadge>)
                    })
                    :
                    item.tags.map((tag) => {//all tags
                      return (<NBBadge key={tag} style={styles(this.props.user.colorTheme).badge}>
                        <NBText style={[fontsStyles(this.props.user.font).text,styles(this.props.user.colorTheme).badgeText]}>
                          {tag}
                        </NBText>
                      </NBBadge>)
                    })
                  }
                  </View>
                </View>
              </NBBody>
              <NBRight>
              <TouchableOpacity style={styles(this.props.user.colorTheme).listItemButton}  onPress={() => {
                if(this.props.user.subscriptions.includes(item.enname)){//unsubs
                  putSubscriptions(this.props.user.name, this.props.user.password, this.props.user.subscriptions.filter((vtuber)=>vtuber!==item.enname), this.props.putSubscriptionsBegin, this.props.putSubscriptionsSuccess, this.props.putSubscriptionsFailure, this.props.searchVtuberRemove, item.enname);
              }else{//subs
                  putSubscriptions(this.props.user.name, this.props.user.password, [item.enname,...this.props.user.subscriptions], this.props.putSubscriptionsBegin, this.props.putSubscriptionsSuccess, this.props.putSubscriptionsFailure, this.props.searchVtuberRemove, item.enname);
                  getAllVtubers([item.enname], this.props.fetchVtubersBegin,this.props.fetchVtubersSuccess,this.props.fetchVtubersFailure);
                }
              }}>
                <NBSpinner color={themeColor('red')} style={[{display:
                  this.props.user.subscriptionsLoading&&this.props.user.subscriptionsLoading[item.enname]?
                  'flex':'none'},
                  styles(this.props.user.colorTheme).listItemButtonIcon]}/>
                <Icon color={themeColor('red')} name={this.props.user.subscriptions.includes(item.enname)?'md-heart-dislike':'md-heart'} size={20} style={[{display:
                  !(this.props.user.subscriptionsLoading&&this.props.user.subscriptionsLoading[item.enname])?
                  'flex':'none'},
                  styles(this.props.user.colorTheme).listItemButtonIcon]}/>
              </TouchableOpacity>
              </NBRight>
            </NBListItem>
          }
          keyExtractor={(item, index) => item + index}
          ListFooterComponent={
            this.props.search.vtubersData.length > 0 && this.props.search.value === ""
            ?
            (
              <TouchableOpacity style={styles(this.props.user.colorTheme).listFooter} onPress={() => {
                getAll(this.props.fetchVtuberBegin,this.props.fetchVtuberSuccess,this.props.fetchVtuberFailure,this.props.user.subscriptions,this.props.search.pageVtuber);
              }}>
                <Text style={fontsStyles(this.props.user.font).ui}>Load More</Text>
              </TouchableOpacity>
            )
            :
            this.props.search.value !== ""
            &&
            (
              <TouchableOpacity style={styles(this.props.user.colorTheme).listFooter} onPress={() => {
                this.props.navigation.navigate('ReportScreen');
                  //queryVtubers(this.props.search.value, this.props.fetchVtuberBegin, this.props.fetchVtuberSuccess, this.props.fetchVtuberFailure)
              }}>
                <Text style={fontsStyles(this.props.user.font).ui}> Couldn't find her/him? </Text>
              </TouchableOpacity>
            )
          }
          onEndReached={() => {
            if(this.props.search.value){
              //potential page
              //queryVtubers(this.props.search.value, this.props.fetchVtuberBegin, this.props.fetchVtuberSuccess, this.props.fetchVtuberFailure)
            }else{
              getAll(this.props.fetchVtuberBegin,this.props.fetchVtuberSuccess,this.props.fetchVtuberFailure,this.props.user.subscriptions,this.props.search.pageVtuber);
            }
          }}
          onEndReachedThreshold={0.05}
          />
          </NBTab>

          <NBTab heading={
            <NBTabHeading style={this.props.search.tab === 1?styles(this.props.user.colorTheme).tabActive:styles(this.props.user.colorTheme).tab}>
              <Icon color={this.props.search.tab===1?'red':'black'} name="logo-youtube"/>
              <Text style={this.props.search.tab===1?[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).tabText,{color:'red'}]:[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).tabText]}>Youtube</Text>
            </NBTabHeading>}>
              {
                this.props.user.googleapikey === ""
                ?
                <View style={styles(this.props.user.colorTheme).buttonContainerYoutube}>
                  <NBText style={fontsStyles(this.props.user.font).ui}>Setup Your</NBText>
                  <NBButton transparent onPress={() => this.props.navigation.navigate('ManageAPIScreen')} style={styles(this.props.user.colorTheme).buttonYoutube}>
                    <NBText style={[fontsStyles(this.props.user.font).ui, styles(this.props.user.colorTheme).buttonTextYoutube]}> Google API Key </NBText>
                  </NBButton>
                  <NBText style={fontsStyles(this.props.user.font).ui}>Before Searching for Youtube Contents</NBText>
                </View>
                :
                <FlatList
                  initialNumToRender={20}
                  ref={(ref) => { this.flatListRef = ref; }}
                  refreshControl={
                    <RefreshControl
                      refreshing={false}
                      onRefresh={this.onRefresh}
                    />
                  }
                  renderItem={({item, index}) => (
                    <View key={index} style={youtubeStyles(this.props.user.colorTheme).listItem}>
                      <View style={youtubeStyles(this.props.user.colorTheme).listItemHeader}>
                        <TouchableOpacity onPress={() =>
                          {Linking.openURL("https://www.youtube.com/watch?v="+item.videoId).catch((err) => console.error('An error occurred', err))}
                          }
                          style={youtubeStyles(this.props.user.colorTheme).listItemHeaderTextWrapper}
                        >
                          <Text numberOfLines={2} style={[youtubeStyles(this.props.user.colorTheme).listItemHeaderText,fontsStyles(this.props.user.font).header]}>{item.title}</Text>
                          <Text numberOfLines={1} style={[youtubeStyles(this.props.user.colorTheme).listItemHeaderSubText,fontsStyles(this.props.user.font).subheader]}>{item.vtubername}</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={youtubeStyles(this.props.user.colorTheme).listItemContent}>
                        {
                          this.state.webviewsYoutube[item.title]
                          ?
                          <WebView
                            style={youtubeStyles(this.props.user.colorTheme).listItemContentVideo}
                            javaScriptEnabled={true}
                            domStorageEnabled={false}
                            source={{uri: 'https://www.youtube.com/embed/' + item.videoId }}
                          />
                          :
                          <TouchableOpacity onPress={()=>{
                            var webviewsYoutube = this.state.webviewsYoutube;
                            webviewsYoutube[item.title] = 1;
                            this.setState({webviewsYoutube: webviewsYoutube});
                          }}>
                            <Image
                              style={youtubeStyles(this.props.user.colorTheme).listItemContentImage}
                              source={item.image?{uri:item.image}:altImg}
                            />
                          </TouchableOpacity>
                        }
                      </View>
                      <View style={youtubeStyles(this.props.user.colorTheme).listItemFooter}>
                        <Text style={[youtubeStyles(this.props.user.colorTheme).listItemFooterText,fontsStyles(this.props.user.font).text]}>{item.displaytime}</Text>
                        <TouchableOpacity style={youtubeStyles(this.props.user.colorTheme).listItemFooterButton} onPress={()=>{
                          this.setState({fullscreenIdYoutube:item.videoId});
                          this.changeScreenOrientation(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
                        }}>
                          <Text style={[youtubeStyles(this.props.user.colorTheme).listItemFooterButtonText,fontsStyles(this.props.user.font).text]}> Full Screen </Text>
                          <Icon name='md-expand' size={14} style={youtubeStyles(this.props.user.colorTheme).listItemFooterButtonIcon}/>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  data = {this.props.search.youtubeData.sort(function(a,b){return b.time - a.time})}
                  keyExtractor={(item, index) => item + index}
                  ListFooterComponent={
                    this.props.search.youtubeData.length > 0 && (
                      <TouchableOpacity style={youtubeStyles(this.props.user.colorTheme).listFooter} onPressed={() => this.onEndReached()}>
                        <Text style={fontsStyles(this.props.user.font).text}>Load More</Text>
                      </TouchableOpacity>
                    )
                  }
                  onEndReached={() => searchVideo(this.props.search.value, this.props.user.googleapikey, this.props.fetchYoutubeBegin, this.props.fetchYoutubeSuccess, this.props.fetchYoutubeFailure, this.props.search.nextPageTokenYoutube)}
                  onEndReachedThreshold={0.05}
                  />
              }
          </NBTab>

          <NBTab heading={
            <NBTabHeading style={this.props.search.tab === 2?styles(this.props.user.colorTheme).tabActive:styles(this.props.user.colorTheme).tab}>
            <Icon color={this.props.search.tab===2?'pink':'black'} name="md-tv"/>
            <Text style={this.props.search.tab===2?[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).tabText,{color:'pink'}]:[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).tabText]}>Bilibili</Text>
          </NBTabHeading>}>
            <FlatList
              initialNumToRender={20}
              ref={(ref) => { this.flatListRef = ref; }}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={this.onRefresh}
                />
              }
              renderItem={({item, index}) => (
                 <View>
                  <View key={index} style={biliStyles(this.props.user.colorTheme).listItem}>
                    <View style={biliStyles(this.props.user.colorTheme).listItemHeader}>
                      <TouchableOpacity onPress={() =>
                        {Linking.openURL("https://www.bilibili.com/video/av"+item.aid).catch((err) => console.error('An error occurred', err))}
                        }
                        style={biliStyles(this.props.user.colorTheme).listItemHeaderTextWrapper}
                      >
                        <Text numberOfLines={2} style={[biliStyles(this.props.user.colorTheme).listItemHeaderText,fontsStyles(this.props.user.font).headercn]}>{item.title}</Text>
                        <Text numberOfLines={1} style={[biliStyles(this.props.user.colorTheme).listItemHeaderSubText,fontsStyles(this.props.user.font).subheadercn]}>{item.name}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={biliStyles(this.props.user.colorTheme).listItemContent}>
                      <TouchableOpacity onPress={()=>{
                        Linking.openURL("https://www.bilibili.com/video/av"+item.aid).catch((err) => console.error('An error occurred', err))
                      }}>
                        <Image
                          style={biliStyles(this.props.user.colorTheme).listItemContentImage}
                          source={item.image?{uri:item.image}:altImg}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={biliStyles(this.props.user.colorTheme).listItemFooter}>
                      <Text style={[biliStyles(this.props.user.colorTheme).listItemFooterText,fontsStyles(this.props.user.font).textcn]}>{item.displaytime}</Text>
                    </View>
                  </View>
                </View>
              )}
              data = {this.props.search.biliData.sort(function(a,b){return b.time - a.time})}
              keyExtractor={(item, index) => item + index}
              ListFooterComponent={
                this.props.search.biliData.length > 0 && (
                  <TouchableOpacity style={biliStyles(this.props.user.colorTheme).listFooter} onPress={() => this.onEndReached()}>
                    <Text style={fontsStyles(this.props.user.font).textcn}>Load More</Text>
                  </TouchableOpacity>
                )
              }
              onEndReached={() => queryVideo(this.props.search.value, this.props.fetchbiliBegin, this.props.fetchbiliSuccess, this.props.fetchbiliFailure, this.props.search.pageBili)}
              onEndReachedThreshold={0.05}
              />
          </NBTab>

          <NBTab heading={
            <NBTabHeading style={this.props.search.tab === 3?styles(this.props.user.colorTheme).tabActive:styles(this.props.user.colorTheme).tab}>
              <Icon color={this.props.search.tab===3?'#6495ED':'black'} name="logo-twitter"/>
              <Text style={this.props.search.tab===3?[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).tabText,{color:'#6495ED'}]:[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).tabText]}>Twitter</Text>
            </NBTabHeading>
          }>
            <FlatList
              initialNumToRender={20}
              data = {
                  this.props.search.twitterData
                  .sort((a,b)=>{
                    return new Date(b.created_at) - new Date(a.created_at);
                  })
                }
              renderItem={({item, index}) => {
                  return (
                    <View key={index}>
                      {this.parseTweet(item)}
                    </View>
                  )
                }
              }
              keyExtractor={(item, index) => item + index}
              />
          </NBTab>
        </NBTabs>
      </NBContainer>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(SearchScreen);
