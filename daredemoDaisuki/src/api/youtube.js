import axios from 'axios';

import { defaultKeyYoutube } from '../secret.js';

const url = "https://www.googleapis.com/youtube/v3";
const videourl = "https://youtu.be/";
const defaultKey = defaultKeyYoutube;

//TODO: If last update - now > 5 min, update backend -> fetch to users
export function getChannelsIDs(youtubeIds, ennames, fetchChannelsBegin, fetchChannelsSuccess,fetchChannelsFailure, key = defaultKey){
  /*
  API Call to https://www.googleapis.com/youtube/v3/channels by ID
  In:
    youtubeIds: array of youtube ID
    ennames: dict of {id:enname}
    Begin,Success,Failure Actions
  Out:
    successAction(array of object)
    -or-
    failureAction()
  */
  fetchChannelsBegin();//begin action
  axios.all(youtubeIds.map(youtubeId =>
    axios.get( url + "/channels", {
      params: {
        part: "snippet",
        key: key,
        id:  youtubeId
      }
    })//get request of each ID
  ))
  .then(axios.spread(function (...responses) {
    var input = [];//array of object
    responses.forEach(res =>{
      for (var i = 0; i < res.data.items.length; i++){
        input.push({
          enname: ennames[res.data.items[i].id],
          id: res.data.items[i].id,
          title: res.data.items[i].snippet.title,
          description: res.data.items[i].snippet.description,
          image: res.data.items[i].snippet.thumbnails.high.url,
        });
      }
    })
    fetchChannelsSuccess(input);//success action
  }))
  .catch((err) => {
    console.log(err);
    fetchChannelsFailure();//failure action
  });
}

export function getChannels(subscriptions, vtubersDict, fetchChannelsBegin, fetchChannelsSuccess,fetchChannelsFailure, pageToken={}, key = defaultKey){
  /*
  API Call to https://www.googleapis.com/youtube/v3/channels by Name
  In:
    subscriptions: array of ennames
    vtubersDict: dictionary of {enname:{...,youtubeId:"233",...}}
    pageToken: dictionary of {id:pageToken}
    Begin,Success,Failure Actions
  Out:
    successAction(array of object)
    -or-
    failureAction()
  */
  fetchChannelsBegin();//begin action
  var youtubeIds = subscriptions.map(vtuber=>vtubersDict[vtuber].youtubeId);//parse from enname to ID
  axios.all(youtubeIds.map(youtubeId =>
    axios.get( url + "/channels", {
      params: {
        part: "snippet",
        key: key,
        pageToken: pageToken[youtubeId],
        id:  youtubeId
      }
    })//get request of each ID
  ))
  .then(axios.spread(function (...responses) {
    var input = [];//array of object
    responses.forEach(res =>{
      for (var i = 0; i < res.data.items.length; i++){
        input.push({
          enname: subscriptions[i],
          nextPageToken: res.data.nextPageToken,
          id: res.data.items[i].id,
          title: res.data.items[i].snippet.title,
          description: res.data.items[i].snippet.description,
          image: res.data.items[i].snippet.thumbnails.high.url,
        });
      }
    })
    fetchChannelsSuccess(input);//success action
  }))
  .catch((err) => {
    console.log(err);
    fetchChannelsFailure();//failure action
  });
}

export function getActivities(subscriptions, vtubersDict, fetchActivitiesBegin,fetchActivitiesSuccess,fetchActivitiesFailure, pageToken={}, key = defaultKey){
  /*
  API Call to https://www.googleapis.com/youtube/v3/activities by Name
  In:
    subscriptions: array of ennames
    vtubersDict: dictionary of {enname:{...,youtubeId:"233",...}}
    pageToken: dictionary of {id:pageToken}
    Begin,Success,Failure Actions
  Out:
    successAction(array of object)
    -or-
    failureAction()
  */
  fetchActivitiesBegin();//begin action
  var youtubeIds = subscriptions.map(vtuber=>vtubersDict[vtuber].youtubeId);//parse enname to ID
  axios.all(youtubeIds.map(youtubeId =>
    axios.get( url + "/activities", {
      params: {
        part: "snippet,contentDetails",
        key: key,
        pageToken: pageToken[youtubeId],
        channelId:  youtubeId
      }
    })//get request of each ID
  ))
  .then(axios.spread(function (...responses) {
    var input = [];//array of object
    responses.forEach(res =>{
      for (var i = 0; i < res.data.items.length; i++){
        try{
          input.push({
            nextPageToken: res.data.nextPageToken,
            channelTitle:  res.data.items[i].snippet.channelTitle,
            channelId: res.data.items[i].snippet.channelId,
            publishedAt: res.data.items[i].snippet.publishedAt,
            title: res.data.items[i].snippet.title,
            description: res.data.items[i].snippet.description,
            image: res.data.items[i].snippet.thumbnails.high.url,
            videoId: res.data.items[i].contentDetails.upload.videoId,
          });
        }catch (err){
          console.log(res.data.items[i].contentDetails);
        }
      }
    })
    fetchActivitiesSuccess(input);//success action
  }))
  .catch((err) => {
    console.log(err);
    fetchActivitiesFailure();//failure action
  });
}

export function searchVideo(query, apikey, fetchYoutubeBegin, fetchYoutubeSuccess, fetchYoutubeFailure, pageToken=""){
  /*
  API Call to https://www.googleapis.com/youtube/v3/search
  In:
    query: String of query
    apikey: String of apikey
    pageToken: String of pageToken
    Begin,Success,Failure Actions
  Out:
    successAction(array of object)
    -or-
    failureAction()
  */
  fetchYoutubeBegin();//begin action
  axios.get( url + "/search", {
    params: {
      part: "snippet",
      key: apikey,
      type: "video",
      pageToken: pageToken,
      q:  query
    }
  })
  .then((res) => {
    var input = [];//array of object
    for (var i = 0; i < res.data.items.length; i++){
      input.push({
        nextPageToken: res.data.nextPageToken,
        videoId: res.data.items[i].id.videoId,
        publishedAt: res.data.items[i].snippet.publishedAt,
        title: res.data.items[i].snippet.title,
        description: res.data.items[i].snippet.description,
        image: res.data.items[i].snippet.thumbnails.high.url,
        channelTitle: res.data.items[i].snippet.channelTitle,
        channelId: res.data.items[i].snippet.channelId
      });
    }
    fetchYoutubeSuccess(input);//success action
  })
  .catch((err) => {
    console.log(err);
    fetchYoutubeFailure();//failure action
  });
}
