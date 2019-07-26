import twitter from 'react-native-simple-twitter';

import { defaultKey, defaultSsecretKey, defaultToken, defaultSecretToken } from '../secret.js';

const tweetsPerPage = 20;

export async function getTimeline(subscriptions, vtubersDict, fetchBegin, fetchSuccess, fetchFailure, max_ids={} , key=defaultKey, secretKey=defaultSsecretKey, token=defaultToken, secretToken=defaultSecretToken){
  /*
  API Call using react-native-simple-twitter, to statuses/user_timeline.json
  In:
    subscriptions: array of ennames
    vtubersDict: dictionary of {enname:{...,twitterId:"233",...}}
    Begin,Success,Failure Actions
    max_id: page idea
    tokens
  Out:
    successAction(array of object,object)
    -or-
    failureAction()
  */
  fetchBegin();//begin
  twitter.setConsumerKey(key, secretKey);
  twitter.setAccessToken(token, secretToken);
  var tweets = [];//tweets list
  var users = {};//users list
  var twitterIds = subscriptions.map(vtuber=>vtubersDict[vtuber].twitterId);//list of twitterIds
  var minDates = {};
  var maxids = twitterIds.map(vtuber=>{
    if(max_ids[vtuber]){
      return max_ids[vtuber]
    }else{
      return -1;
    }
  });
  var promises = twitterIds.map(vtuber=>{
    if(max_ids[vtuber]){
      return twitter.get("statuses/user_timeline.json",{screen_name:vtuber,count:tweetsPerPage, max_id: max_ids[vtuber]})
    }else{
      return twitter.get("statuses/user_timeline.json",{screen_name:vtuber,count:tweetsPerPage})
    }
  }
  );//list of promises
  Promise.all(promises)
  .then(values => {
    values.forEach(value=>{
      if (value.error) {
        console.log(value); //account error
      }else {
        let length = value.length;
        for (var i = 0; i < length; i ++){
          let val = value[i];
          if ( maxids[i] !== -1 && i === 0 ){
            //skip repeated tweets
          }else{
            if(length >= tweetsPerPage){
              minDates[val.user.screen_name] = new Date(val.created_at);
              max_ids[val.user.screen_name] = val.id;
            }else{
              minDates[val.user.screen_name] = new Date("July 1, 1970");
              max_ids[val.user.screen_name] = val.id;
            }
            tweets.push({
              created_at: val.created_at,
              favorite_count: val.favorite_count,
              retweet_count:val.retweet_count,
              id:val.id,
              in_reply_to_screen_name:val.in_reply_to_screen_name,
              in_reply_to_status_id:val.in_reply_to_status_id,
              in_reply_to_user_id:val.in_reply_to_user_id,
              source:val.source,
              text:val.text,
              user: val.user,
              entities: val.entities,
              quoted_status: val.quoted_status,
              retweeted_status: val.retweeted_status,
              extended_tweet: val.extended_tweet,
              truncated: val.truncated,
              extended_entities: val.extended_entities,
            })//parsed tweets
            users[val.user.screen_name] = {
              screen_name: val.user.screen_name,
              profile_image_url: val.user.profile_image_url?val.user.profile_image_url.replace('_normal',"_bigger"):val.user.profile_image_url,
              profile_banner_url: val.user.profile_banner_url,
              name: val.user.name,
              user_id: val.user.id,
              user_description:val.user.description,
              user_entities:val.user.entities, // description:{urls:[{display_url:xx,expanded_url:xx,indices:[a,b],url:xx}]}
              user_favourites_count:val.user.favourites_count,
              user_followers_count:val.user.followers_count,
              user_friends_count:val.user.friends_count,
              user_listed_count:val.user.listed_count,
              user_statuses_count:val.user.statuses_count,
            }//parsed users
          }
        }
      }
    })
    fetchSuccess(tweets,users,max_ids,minDates)//success
  })
  .catch((err) => {
    console.log(err);
    fetchFailure();//failure
  });
}

export async function query(query, fetchBegin, fetchSuccess, fetchFailure, key=defaultKey, secretKey=defaultSsecretKey, token=defaultToken, secretToken=defaultSecretToken){
  /*
  API Call using react-native-simple-twitter, to search/tweets.json
  In:
    query: String to query
    Begin,Success,Failure Actions
  Out:
    successAction(array of object)
    -or-
    failureAction()
  */
  var tweets = [];//tweets list
  fetchBegin();//begin
  twitter.setConsumerKey(key, secretKey);
  twitter.setAccessToken(token, secretToken);
  try {
    const get = await twitter.get("search/tweets.json",{q:query,count:100});//get req
    if (get.errors){
      console.log(get.errors);
      fetchFailure();//failure
    }else{
      get.statuses.forEach((val) => {
        tweets.push({
          created_at: val.created_at,
          favorite_count: val.favorite_count,
          retweet_count:val.retweet_count,
          id:val.id,
          in_reply_to_screen_name:val.in_reply_to_screen_name,
          in_reply_to_status_id:val.in_reply_to_status_id,
          in_reply_to_user_id:val.in_reply_to_user_id,
          source:val.source,
          text:val.text,
          user: val.user,
          entities: val.entities,
          quoted_status: val.quoted_status,
          retweeted_status: val.retweeted_status,
          extended_tweet: val.extended_tweet,
          truncated: val.truncated,
          extended_entities: val.extended_entities,
        })//parsed tweets
      })
      fetchSuccess(tweets);//success
    }
  } catch (err) {
    console.log(err);
    fetchFailure();//failure
  }
}

export async function getUsers(twitterIds, ennames, fetchBegin, fetchSuccess, fetchFailure, key=defaultKey, secretKey=defaultSsecretKey, token=defaultToken, secretToken=defaultSecretToken){
  /*
  API Call using react-native-simple-twitter, to users/show.json
  In:
    twitterIds: array of screen_names
    ennames: dict of {id:enname}
    Begin,Success,Failure Actions
  Out:
    successAction(array of object)
    -or-
    failureAction()
  */
  fetchBegin();//begin
  twitter.setConsumerKey(key, secretKey);
  twitter.setAccessToken(token, secretToken);
  var users = [];//users list
  var promises = twitterIds.map(vtuber=>twitter.get("users/show.json",{screen_name:vtuber}));//list of promises
  Promise.all(promises)
  .then(values => {
    for (var i = 0; i < values.length; i++){
      if (values[i].error) {
        console.log(values[i]); //account error
      }else {
        users.push({
          enname: ennames[values[i].screen_name],
          screen_name: values[i].screen_name,
          profile_image_url: values[i].profile_image_url?values[i].profile_image_url.replace('_normal',"_bigger"):values[i].profile_image_url,
          profile_banner_url: values[i].profile_banner_url,
          name: values[i].name,
          user_id: values[i].id,
          user_description:values[i].description,
          user_entities:values[i].entities, // description:{urls:[{display_url:xx,expanded_url:xx,indices:[a,b],url:xx}]}
          user_favourites_count:values[i].favourites_count,
          user_followers_count:values[i].followers_count,
          user_friends_count:values[i].friends_count,
          user_listed_count:values[i].listed_count,
          user_statuses_count:values[i].statuses_count,
        })//parsed users
      }
    }
    fetchSuccess(users)//success
  })
  .catch((err) => {
    console.log(err);
    fetchFailure();//failure
  });
}
