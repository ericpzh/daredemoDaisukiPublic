import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Header as NBHeader, Item as NBItem, Input as NBInput } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { colorTheme } from '../../styles/colorTheme.js';
import { searchValue, fetchVtuberBegin, fetchVtuberSuccess, fetchVtuberFailure, fetchYoutubeBegin, fetchYoutubeSuccess, fetchYoutubeFailure, fetchTwitterBegin, fetchTwitterSuccess, fetchTwitterFailure, fetchbiliBegin, fetchbiliSuccess, fetchbiliFailure, resetData, reset } from '../../actions/searchActions.js';
import { searchVideo } from '../../api/youtube.js';
import { queryVtubers } from '../../api/vtubers.js';
import { queryVideo } from '../../api/bilibili.js';
import { query } from '../../api/twitter.js';
import { fonts } from '../../styles/fonts.js';

const mapStateToProps = (state) => {
  const { search, vtuber, user } = state
  return { search, vtuber, user }
};

const mapDispatchToProps = dispatch => ({
  searchValue: (value) => dispatch(searchValue(value)),
  fetchYoutubeBegin: () => dispatch(fetchYoutubeBegin()),
  fetchYoutubeSuccess: (input) => dispatch(fetchYoutubeSuccess(input)),
  fetchYoutubeFailure: () => dispatch(fetchYoutubeFailure()),
  fetchTwitterBegin: () => dispatch(fetchTwitterBegin()),
  fetchTwitterSuccess: (input) => dispatch(fetchTwitterSuccess(input)),
  fetchTwitterFailure: () => dispatch(fetchTwitterFailure()),
  fetchbiliBegin: () => dispatch(fetchbiliBegin()),
  fetchbiliSuccess: (input) => dispatch(fetchbiliSuccess(input)),
  fetchbiliFailure: () => dispatch(fetchbiliFailure()),
  fetchVtuberBegin: () => dispatch(fetchVtuberBegin()),
  fetchVtuberSuccess: (input) => dispatch(fetchVtuberSuccess(input)),
  fetchVtuberFailure: () => dispatch(fetchVtuberFailure()),
  reset: () => dispatch(reset()),
  resetData: () => dispatch(resetData()),
});

class SearchNavigationHeader extends Component {
  /*
  Customize search bar header
  */
  search = ()=> {
    /*
    on search
    */
    if(this.props.search.tab === 0){ //Vtubers
      this.props.resetData();
      queryVtubers(this.props.search.value, this.props.fetchVtuberBegin, this.props.fetchVtuberSuccess, this.props.fetchVtuberFailure)
    }else if(this.props.search.tab === 1){ //Youtube
      this.props.resetData();
      searchVideo(this.props.search.value, this.props.user.googleapikey , this.props.fetchYoutubeBegin, this.props.fetchYoutubeSuccess, this.props.fetchYoutubeFailure,  this.props.search.nextPageTokenYoutube);
    }else if(this.props.search.tab === 2){ //Bili
      this.props.resetData();
      queryVideo(this.props.search.value, this.props.fetchbiliBegin, this.props.fetchbiliSuccess, this.props.fetchbiliFailure, this.props.search.pageBili);
    }else if(this.props.search.tab === 3){ //Twitter
      this.props.resetData();
      var tkey = this.props.user.twitterapikey.key;
      var tsecretKey = this.props.user.twitterapikey.secretKey;
      var ttoken = this.props.user.twitterapikey.token;
      var tsecretToken = this.props.user.twitterapikey.secretToken;
      if (tkey != "" && tsecretKey != "" && ttoken != "" && tsecretToken != ""){
        query(this.props.search.value, this.props.fetchTwitterBegin, this.props.fetchTwitterSuccess, this.props.fetchTwitterFailure,tkey,tsecretKey,ttoken,tsecretToken);
      }else if(tkey != "" && tsecretKey != ""){
        query(this.props.search.value, this.props.fetchTwitterBegin, this.props.fetchTwitterSuccess, this.props.fetchTwitterFailure,tkey,tsecretKey);
      }else{
        query(this.props.search.value, this.props.fetchTwitterBegin, this.props.fetchTwitterSuccess, this.props.fetchTwitterFailure);
      }
    }
  }
  render(){
    var loading =
    (
      (this.props.search.tab===0&&(this.props.search.loadingVtuber||this.props.vtuber.loadingImage))
      ||
      (this.props.search.tab===1&&this.props.search.loadingYoutube)
      ||
      (this.props.search.tab===2&&this.props.search.loadingBili)
      ||
      (this.props.search.tab===3&&this.props.search.loadingTwitter)
    )
    return (
      <View style={{width:"100%"}}>
        <NBHeader searchBar rounded style={{backgroundColor:colorTheme[this.props.user.colorTheme].themeColor}}>
          <NBItem>
            <NBInput placeholder={ loading?"Loading...":"Search" } autofocus onSubmitEditing={this.search} style={{paddingLeft:10,...fonts(this.props.user.font).ui}} value={this.props.search.value} onChangeText={(value: string)=>{this.props.searchValue(value)}}/>
            <TouchableOpacity onPress={this.search}>
              <Icon size={20} name="md-search" style={{paddingRight:10}}/>
            </TouchableOpacity>
          </NBItem>
        </NBHeader>
      </View>
    )
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(SearchNavigationHeader);
