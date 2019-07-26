import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { styles } from '../styles/splashScreenStyles.js';
import { initFetch } from '../api/custom.js';
import { getAllVtubers } from '../api/vtubers.js';
import { reset } from '../actions/searchActions.js';
import { vtuberInit, fetchImageBeginYoutube, fetchImageSuccessYoutube, fetchImageFailureYoutube, fetchImageBeginTwitter, fetchImageSuccessTwitter, fetchImageFailureTwitter, fetchImageBeginBili, fetchImageSuccessBili, fetchImageFailureBili, fetchVtubersBegin, fetchVtubersSuccess, fetchVtubersFailure } from '../actions/vtuberActions.js';
import  LoadingComponent  from '../assets/loading.js';
import { setPrevScreen } from '../actions/globalActions.js';
import { getUsers } from '../api/twitter.js';
import { getAccountById } from '../api/bilibili.js';
import { getChannelsIDs } from '../api/youtube.js';

const mapStateToProps = (state) => {
  const { user, vtuber } = state
  return { user, vtuber }
};

const mapDispatchToProps = dispatch => ({
  reset: () => dispatch(reset()),
  vtuberInit: () => dispatch(vtuberInit()),
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
  setPrevScreen: (input) => dispatch(setPrevScreen(input)),
});

class SplashScreen extends React.Component {
  /*
  Switch Between App & Auth
  */
  componentDidMount() {
    if(willBlurSubscription){
      willBlurSubscription.remove();
    }
    let willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload => {
        this.props.setPrevScreen("SplashScreen");
      }
    );
    this.props.reset();//clear all props.search
    this.props.vtuberInit();//clear all props.vtuber
    setTimeout(()=>{//allow redux change store
      if (this.props.user.name !== "" && this.props.user.subscriptions.length !== 0) {
        initFetch(this.props.user, this.props.fetchVtubersBegin,this.props.fetchVtubersSuccess,this.props.fetchVtubersFailure,getChannelsIDs,getUsers,getAccountById,this.props.fetchImageBeginYoutube,this.props.fetchImageSuccessYoutube,this.props.fetchImageFailureYoutube,this.props.fetchImageBeginTwitter,this.props.fetchImageSuccessTwitter,this.props.fetchImageFailureTwitter,this.props.fetchImageBeginBili,this.props.fetchImageSuccessBili,this.props.fetchImageFailureBili);//Initialize App Data
      }else if(this.props.user.name !== ""){//new user
        this.props.navigation.navigate("App");//To App
      }else {
        this.props.navigation.navigate("Auth");//To Auth
      }
    }, 50)
  }
  componentDidUpdate(prevProps){
    if((prevProps.vtuber.loadingImageYoutube||prevProps.vtuber.loadingImageTwitter||prevProps.vtuber.loadingImageBili) && (!this.props.vtuber.loadingImageYoutube&& !this.props.vtuber.loadingImageTwitter&& !this.props.vtuber.loadingImageBili)){//if loading finished
      if(this.props.vtuber.vtuberDict === {}){
        initFetch(this.props.user, this.props.fetchVtubersBegin,this.props.fetchVtubersSuccess,this.props.fetchVtubersFailure,getChannelsIDs,getUsers,getAccountById,this.props.fetchImageBeginYoutube,this.props.fetchImageSuccessYoutube,this.props.fetchImageFailureYoutube,this.props.fetchImageBeginTwitter,this.props.fetchImageSuccessTwitter,this.props.fetchImageFailureTwitter,this.props.fetchImageBeginBili,this.props.fetchImageSuccessBili,this.props.fetchImageFailureBili);//Initialize App Data
      }else{
        this.props.navigation.navigate("App");//To App
      }
    }else if(prevProps.user !== this.props.user && this.props.user.name !== "" && this.props.user.subscriptions.length === 0){//new user
      this.props.navigation.navigate("App");//To App
    }
  }
  render(){
    return (<View style={styles(this.props.user.colorTheme).container}><LoadingComponent/></View>)//render
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
