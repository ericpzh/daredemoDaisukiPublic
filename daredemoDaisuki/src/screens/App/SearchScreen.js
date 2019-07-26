import React from 'react';
import {Text, View, TouchableOpacity, FlatList, Linking, Image, Modal, Dimensions, WebView, RefreshControl } from 'react-native';
import { Badge as NBBadge, Container as NBContainer, Text as NBText, Tab as NBTab, Tabs as NBTabs, TabHeading as NBTabHeading, ScrollableTab as NBScrollableTab, Content as NBContent, ListItem as NBListItem, Left as NBLeft, Right as NBRight, Body as NBBody, Thumbnail as NBThumbnail, Spinner as NBSpinner, Button as NBButton, Toast as NBToast } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { colorTheme } from '../../styles/colorTheme.js';
import { styles, fontsStyles } from '../../styles/App/searchScreenStyles.js';
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
      fullSreenType: "",
      displayUrl: "",
      fullscreenIdBili: "",
      webviewsBili: {},
    }
    this.parseTweet = this.parseTweet.bind(this);
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
  parseTweet(data){
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
        ret = [ (this.parseTweet(data.retweeted_status)) ]; //directly show retweet obj.
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
              dict[url.indices[0]] = {type:"url", url:url.url, end:url.indices[1]}//put urls in dict
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
              obj = media.video_info.variants.filter((v)=>v.content_type === "video/mp4").sort((a,b)=>a.bitrate-b.bitrate);
              videoMp4 = obj && obj[0] ? obj[0].url : "";
              dict[media.indices[0]] = {type:"media", url:media.media_url, mediaType:"videomp4", preview:media.media_url, media_url:videoMp4, end:media.indices[1]}//put media in dict
            }else{
              dict[media.indices[0]] = {type:"media", url:media.media_url, mediaType:media.type, media_url:media.media_url, end:media.indices[1]}//put media in dict
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
            (<Text style={{color:'grey'}}> {"Replying to: "} </Text>)
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
                  <Text style={{color:'blue'}}>{"#" + dict[i].text}</Text>
                </TouchableOpacity>);
            }else if(dict[i].type === 'mention'){//if is #
              text.push(
                <TouchableOpacity key={i + "mention"} onPress={()=>{
                  Linking.openURL("https://twitter.com/"+entities[curr].screen_name).catch((err) => console.error('An error occurred', err))
                }}>
                  <Text style={{color:'blue'}}>{"@" + dict[i].screen_name}</Text>
                </TouchableOpacity>);
            }else if(dict[i].type === 'media'){//media
              if(dict[i].mediaType === "video"){//if is video
                if(this.state.displayUrl === entities[curr].media_url){//enlarge a video
                  media.push(
                    <View style={styles(this.props.user.colorTheme).listItemContentWebViewContainerTwitter}>
                    <WebView
                      style={styles(this.props.user.colorTheme).listItemContentImageTwitter}
                      javaScriptEnabled={true}
                      domStorageEnabled={false}
                      source={{uri: "https://www.youtube.com/embed/" + this.state.displayUrl.replace("youtu.be/","") }}
                    />
                    </View>
                  )
                }else{//video preview
                  media.push(
                    <TouchableOpacity style={styles(this.props.user.colorTheme).listItemContentImageContainerTwitter} onPress={()=>{
                      this.setState({displayUrl:entities[curr].media_url});
                    }} key={entities[curr].preview + "photo"}>
                      <Image style={styles(this.props.user.colorTheme).listItemContentImageTwitter} source={entities[curr].preview ? {uri: entities[curr].preview} : altImg}/>
                    </TouchableOpacity>
                  )
                }
              }else if(dict[i].mediaType === "videomp4"){//mp4 video
                if(this.state.displayUrl === entities[curr].media_url){//enlarge a video
                  media.push(
                    <View style={styles(this.props.user.colorTheme).listItemContentWebViewContainerTwitter}>
                      <WebView
                        style={styles(this.props.user.colorTheme).listItemContentImageTwitter}
                        javaScriptEnabled={true}
                        domStorageEnabled={false}
                        source={{uri: this.state.displayUrl }}
                      />
                    </View>
                  )
                }else{//video preview
                  media.push(
                    <TouchableOpacity style={styles(this.props.user.colorTheme).listItemContentImageContainerTwitter} onPress={()=>{
                      this.setState({displayUrl:entities[curr].media_url});
                    }} key={entities[curr].preview + "photo"}>
                      <Image style={styles(this.props.user.colorTheme).listItemContentImageTwitter} source={entities[curr].preview ? {uri: entities[curr].preview} : altImg}/>
                    </TouchableOpacity>
                  )
                }
              }else if(!hasVideo && dict[i].mediaType === "photo"){//if is image
                media.push(
                  <TouchableOpacity style={styles(this.props.user.colorTheme).listItemContentImageContainerTwitter} onPress={()=>{
                    this.setState({fullScreenUrl: entities[curr].media_url,fullSreenType:"image"});
                  }} key={entities[curr].media_url + "photo"}>
                    <Image style={styles(this.props.user.colorTheme).listItemContentImageTwitter} source={entities[curr].media_url ? {uri: entities[curr].media_url} : altImg}/>
                  </TouchableOpacity>
              )}else if(dict[i].mediaType === "youtubeLink"){//youtube link
                media.push(
                  <TouchableOpacity key={i + "mention"} onPress={()=>{
                    Linking.openURL("https://www.youtube.com/watch?v="+ entities[curr].media_url.replace("youtu.be/","")).catch((err) => console.error('An error occurred', err))
                  }}>
                    <Text style={{color:'blue'}}>{dict[i].media_url}</Text>
                  </TouchableOpacity>);
              }else{//if is gif

              }
            }
          }else{//normal char
            !skipIdxs[i] && text.push(<Text key={i}>{char}</Text>);
          }
          i++;
        }
        ret.push(
          <View style={styles(this.props.user.colorTheme).listItemContentTextTwitter} key={data.text + "textview"}>
          {text}
          </View>
        );//Finished <Text/> part
        ret.push(
          <View style={styles(this.props.user.colorTheme).listItemContentMediaTwitter} key={data.text + "textview"}>
          {media}
          </View>
        )
        if(data.quoted_status){//if have quoted
          ret.push(this.parseTweet(data.quoted_status));//continue parse quote
        }
        if(data.extended_tweet){//if have extended_tweet
          if(data.truncated){//if truncated
            return this.parseTweet(data.extended_tweet);//use truncated extended_tweet not this tweet
          }
        }
      }
      var date = new Date(data.created_at);
      return (
        <View style={styles(this.props.user.colorTheme).listItemTwitter} key={data.text + "wrapper"}>
          <View style={styles(this.props.user.colorTheme).listItemHeaderTwitter}>
            <TouchableOpacity onPress={() =>
              {Linking.openURL("https://twitter.com/"+data.user.screen_name).catch((err) => console.error('An error occurred', err))}
            }>
              <NBThumbnail
                style={styles(this.props.user.colorTheme).listItemHeaderImageTwitter}
                source={data.user.profile_image_url.replace('_normal',"_bigger") ?{uri: data.user.profile_image_url.replace('_normal',"_bigger") }: altImg}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() =>
              {Linking.openURL("https://twitter.com/"+data.user.screen_name).catch((err) => console.error('An error occurred', err))}
            }>
              <View style={styles(this.props.user.colorTheme).listItemHeaderTextWrapperTwitter}>
                <Text style={styles(this.props.user.colorTheme).listItemHeaderTextTwitter}>{data.user.name}</Text>
                <Text style={styles(this.props.user.colorTheme).listItemHeaderSubTextTwitter}>{data.user.screen_name}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles(this.props.user.colorTheme).listItemContentTwitter}>
              { ret }
          </View>
          <View style={styles(this.props.user.colorTheme).listItemFooterTwitter}>
            <Text style={styles(this.props.user.colorTheme).listItemFooterTextTwitter}>
            {
              date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate())  + ' ' +  (date.getHours().toString().length === 1?"0"+date.getHours().toString():date.getHours().toString()) + ':' + (date.getMinutes().toString().length === 1?"0"+date.getMinutes().toString():date.getMinutes().toString())
            }
            </Text>
            {
              (hasVideo && videoId !== "") || videoMp4 !== "" &&
              <TouchableOpacity style={styles(this.props.user.colorTheme).listItemFooterButtonTwitter} onPress={()=>{
                this.setState({fullScreenUrl: videoMp4 !== ""?videoMp4:'https://www.youtube.com/embed/' + videoId, fullSreenType:"video"});
              }}>
                <Text style={styles(this.props.user.colorTheme).listItemFooterTextTwitter}> Full Screen </Text>
                <Icon name='md-expand' size={14} style={styles(this.props.user.colorTheme).listItemFooterIconTwitter}/>
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
          visible={this.state.fullScreenUrl!==""}
          onRequestClose={() => { this.setState({fullScreenUrl: ""}); }}
          onDismiss={() => { this.setState({fullScreenUrl: ""}); }}
          >
          <View style={styles(this.props.user.colorTheme).fullscreenContainer}>
            {
              this.state.fullSreenType === "image"
              ?
              <ImageViewer imageUrls={[
                {url:this.state.fullScreenUrl}
              ]}/>
              :
              <WebView
                style={{transform: [{ rotate: '90deg'},{scaleX: height/width},{scaleY: height/width}]}}
                scalesPageToFit={true}
                javaScriptEnabled={true}
                domStorageEnabled={false}
                source={{uri: this.state.fullScreenUrl }}
              />
            }
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.fullscreenIdBili!==""}
          onRequestClose={() => { this.setState({fullscreenIdBili: ""}); }}
          onDismiss={() => { this.setState({fullscreenIdBili: ""}); }}
          >
          <View style={styles(this.props.user.colorTheme).fullscreenContainerBili}>
          <WebView
            style={{transform: [{ rotate: '90deg'},{scaleX: height/width},{scaleY: height/width}]}}
            javaScriptEnabled={true}
            domStorageEnabled={false}
            source={{uri: 'https://www.bilibili.com/video/av' + this.state.fullscreenIdBili }}
          />
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.fullscreenIdYoutube!==""}
          onRequestClose={() => { this.setState({fullscreenIdYoutube: ""}); }}
          onDismiss={() => { this.setState({fullscreenIdYoutube: ""}); }}
          >
          <View style={styles(this.props.user.colorTheme).fullscreenContainerYoutube}>
          <WebView
            style={{transform: [{ rotate: '90deg'},{scaleX: height/width},{scaleY: height/width}]}}
            javaScriptEnabled={true}
            domStorageEnabled={false}
            source={{uri: 'https://www.youtube.com/embed/' + this.state.fullscreenIdYoutube }}
          />
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
          <NBTab heading={ <NBTabHeading style={styles(this.props.user.colorTheme).tab}><Icon name="md-heart"/>
            <Text style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).tabText]}>Vtubers</Text>
          </NBTabHeading>}>
          <FlatList
            data={this.props.search.vtubersData}
            renderItem={({item, index}) =>
            <NBListItem avatar key={index}>
              <NBLeft>
                <NBThumbnail source={this.props.vtuber.vtubersImage[item.enname]
                  ?{ uri: this.props.vtuber.vtubersImage[item.enname]
                  }:altImg} />
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
                <NBSpinner color={colorTheme[this.props.user.colorTheme].textPrimary} style={[{display:
                  this.props.user.subscriptionsLoading&&this.props.user.subscriptionsLoading[item.enname]?
                  'flex':'none'},
                  styles(this.props.user.colorTheme).listItemButtonIcon]}/>
                <Icon name={this.props.user.subscriptions.includes(item.enname)?'md-heart-dislike':'md-heart'} size={20} style={[{display:
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
            <NBTabHeading style={styles(this.props.user.colorTheme).tab}><Icon name="logo-youtube"/>
              <Text style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).tabText]}>Youtube</Text>
            </NBTabHeading>}>
              {
                this.props.user.googleapikey === ""
                ?
                <View style={styles(this.props.user.colorTheme).buttonContainerYoutube}>
                  <NBText>Setup Your</NBText>
                  <NBButton transparent onPress={() => this.props.navigation.navigate('ManageAPIScreen')} style={styles(this.props.user.colorTheme).buttonYoutube}>
                    <NBText style={styles(this.props.user.colorTheme).buttonTextYoutube}> Google API Key </NBText>
                  </NBButton>
                  <NBText>Before Searching for Youtube Contents</NBText>
                </View>
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
                    <View key={index} style={styles(this.props.user.colorTheme).listItemYoutube}>
                      <View style={styles(this.props.user.colorTheme).listItemHeaderYoutube}>
                        <TouchableOpacity onPress={() =>
                          {Linking.openURL("https://www.youtube.com/watch?v="+item.videoId).catch((err) => console.error('An error occurred', err))}
                        }>
                          <View style={styles(this.props.user.colorTheme).listItemHeaderTextWrapperYoutube}>
                            <Text style={styles(this.props.user.colorTheme).listItemHeaderTextYoutube}>{item.title}</Text>
                            <Text style={styles(this.props.user.colorTheme).listItemHeaderSubTextYoutube}>{item.vtubername}</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={styles(this.props.user.colorTheme).listItemContentYoutube}>
                        {
                          this.state.webviewsYoutube[item.title]
                          ?
                          <WebView
                            style={[{width:width-50,height:(width-50)/16*9},styles(this.props.user.colorTheme).listItemContentVideoYoutube]}
                            javaScriptEnabled={true}
                            domStorageEnabled={false}
                            source={{uri: 'https://www.youtube.com/embed/' + item.videoId }}
                          />
                          :
                          <TouchableOpacity onPress={()=>{
                            var webviewsYoutube = this.state.webviewsYoutube;
                            webviewsYoutube[item.title] = true;
                            this.setState({webviewsYoutube: webviewsYoutube});
                          }}>
                            <Image
                              style={[{width:width-50,height:(width-50)/16*9},styles(this.props.user.colorTheme).listItemContentImageYoutube]}
                              source={item.image?{uri:item.image}:altImg}
                            />
                          </TouchableOpacity>
                        }
                      </View>
                      <View style={styles(this.props.user.colorTheme).listItemFooterYoutube}>
                        <Text style={styles(this.props.user.colorTheme).listItemFooterTextYoutube}>{item.displaytime}</Text>
                          <TouchableOpacity style={styles(this.props.user.colorTheme).listItemFooterButtonYoutube} onPress={()=>{
                            this.setState({fullscreenIdYoutube:item.videoId})
                          }}>
                            <Text style={styles(this.props.user.colorTheme).listItemFooterTextYoutube}> Full Screen </Text>
                            <Icon name='md-expand' size={14} style={styles(this.props.user.colorTheme).listItemFooterIconYoutube}/>
                          </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  data = {this.props.search.youtubeData.sort(function(a,b){return b.time - a.time})}
                  keyExtractor={(item, index) => item + index}
                  ListFooterComponent={
                    this.props.search.youtubeData.length > 0 && (
                      <TouchableOpacity style={styles(this.props.user.colorTheme).listFooterYoutube} onPress={() => this.onEndReached()}>
                        <Text style={fontsStyles(this.props.user.font).ui}>Load More</Text>
                      </TouchableOpacity>
                    )
                  }
                  onEndReached={() => this.onEndReached()}
                  onEndReachedThreshold={0.05}
                  />
              }
          </NBTab>

          <NBTab heading={
            <NBTabHeading style={styles(this.props.user.colorTheme).tab}><Icon name="md-tv"/>
            <Text style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).tabText]}>Bilibili</Text>
          </NBTabHeading>}>
          <FlatList
            ref={(ref) => { this.flatListRef = ref; }}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={this.onRefresh}
              />
            }
            renderItem={({item, index}) => (
                <View key={index} style={styles(this.props.user.colorTheme).listItemBili}>
                  <View style={styles(this.props.user.colorTheme).listItemHeaderBili}>
                    <TouchableOpacity onPress={() =>
                      {Linking.openURL("https://www.bilibili.com/video/av"+item.aid).catch((err) => console.error('An error occurred', err))}
                    }>
                      <View style={styles(this.props.user.colorTheme).listItemHeaderTextWrapperBili}>
                        <Text style={styles(this.props.user.colorTheme).listItemHeaderTextBili}>{item.title}</Text>
                        <Text style={styles(this.props.user.colorTheme).listItemHeaderSubTextBili}>{item.name}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles(this.props.user.colorTheme).listItemContentBili}>
                    {
                      this.state.webviewsBili[item.title]
                      ?
                      <WebView
                        style={[{width:width-50,height:(width-50)/16*9},styles(this.props.user.colorTheme).listItemContentVideoBili]}
                        javaScriptEnabled={true}
                        domStorageEnabled={false}
                        source={{uri: 'https://www.bilibili.com/video/av' + item.aid }}
                      />
                      :
                      <TouchableOpacity onPress={()=>{
                        var webviewsBili = this.state.webviewsBili;
                        webviewsBili[item.title] = true;
                        this.setState({webviewsBili: webviewsBili });
                      }}>
                        <Image
                          style={[{width:width-50,height:(width-50)/16*9},styles(this.props.user.colorTheme).listItemContentImageBili]}
                          source={item.image?{uri:item.image}:altImg}
                        />
                      </TouchableOpacity>
                    }
                  </View>
                  <View style={styles(this.props.user.colorTheme).listItemFooterBili}>
                    <Text style={styles(this.props.user.colorTheme).listItemFooterTextBili}>{item.displaytime}</Text>
                      <TouchableOpacity style={styles(this.props.user.colorTheme).listItemFooterButtonBili} onPress={()=>{
                        this.setState({fullscreenIdBili:item.aid})
                      }}>
                        <Text style={styles(this.props.user.colorTheme).listItemFooterTextBili}> Full Screen </Text>
                        <Icon name='md-expand' size={14} style={styles(this.props.user.colorTheme).listItemFooterIconBili}/>
                      </TouchableOpacity>
                  </View>
                </View>
            )}
            data = {this.props.search.biliData}
            keyExtractor={(item, index) => item + index}
            ListFooterComponent={
              this.props.search.biliData.length > 0 && (
                <TouchableOpacity style={styles(this.props.user.colorTheme).listFooterBili} onPress={() => this.onEndReached()}>
                  <Text style={fontsStyles(this.props.user.font).ui}>Load More</Text>
                </TouchableOpacity>
              )
            }
            onEndReached={() => queryVideo(this.props.search.value, this.props.fetchbiliBegin, this.props.fetchbiliSuccess, this.props.fetchbiliFailure, this.props.search.pageBili)}
            onEndReachedThreshold={0.05}
            />
          </NBTab>

          <NBTab heading={ <NBTabHeading style={styles(this.props.user.colorTheme).tab}><Icon name="logo-twitter"/><Text style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).tabText]}>Twitter</Text></NBTabHeading>}>
              <FlatList
                data = {
                    this.props.search.twitterData
                    .sort((a,b)=>{
                      return new Date(b.created_at) - new Date(a.created_at);
                    })
                    .slice(0, this.props.search.twitterlimit)
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
                ListFooterComponent={
                  (
                    <TouchableOpacity style={styles(this.props.user.colorTheme).listFooterTwitter} onPress={() => {
                      this.props.searchTwitterEndReached();
                    }}>
                    {
                      this.props.search.twitterData.length > 0?
                      <Text style={fontsStyles(this.props.user.font).ui}>Load More</Text>:
                      <View/>
                    }
                    </TouchableOpacity>
                  )
                }
                onEndReached={() => {
                  this.props.searchTwitterEndReached();
                }}
                onEndReachedThreshold={0.05}
                />
          </NBTab>
        </NBTabs>
      </NBContainer>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(SearchScreen);
