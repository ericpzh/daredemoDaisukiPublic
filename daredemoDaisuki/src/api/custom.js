import axios from 'axios';

const userurl = "https://daredemodaisuki.herokuapp.com/api";
const vtuberurl = "https://daredemodaisuki.herokuapp.com/api";
const youtubeurl = "https://www.googleapis.com/youtube/v3";
const key = "AIzaSyCNHDQoUdK8hCqx1aWQZYep-O1GC8VNQ9Y";

export function initFetch(user, fetchVtubersBegin, fetchVtubersSuccess, fetchVtubersFailure, youtubeFetch,twitterFetch,biliFetch,fetchBeginYoutube,fetchSuccessYoutube,fetchFailureYoutube,fetchBeginTwitter,fetchSuccessTwitter,fetchFailureTwitter,fetchBeginBili,fetchSuccessBili,fetchFailureBili){
  /*
  To initialize fetch after successful login/siginup/logged in + open app
  API Call to https://daredemodaisuki.herokuapp.com/api/users -> https://daredemodaisuki.herokuapp.com/api/vtubers -> https://www.googleapis.com/youtube/v3/channels
  In:
    user: user object
    Account Begin,Success,Failure Actions
    Vtubers Begin,Success,Failure Actions
    Channel Images Begin,Success,Failure Actions
  Out:
    successAction(list of object) x 2
    -or-
    failureAction() x 1
  */
  var input = user;
  var subscriptions = input.subscriptions;
  if( subscriptions.length > 0 ){//check if subscriptions count > 0
    fetchVtubersBegin();//vtuber begin
    var strnames = "";
    subscriptions.forEach((enname)=>{
      strnames += enname + ",";
    })//map ennames to a string e.g. "Shirakami Fubuki,Minato Aqua,"
    strnames = strnames.substring(0,strnames.length - 1);//remove the last comma
    axios.get(vtuberurl + '/vtubers',{
      params:{
        ennames: strnames,
      }
    })
    .then((res)=>{
      var input = res.data.data;
      var vtubers = input.filter((vtuber) => {return subscriptions.indexOf(vtuber.enname) >= 0});
      imageFetch(vtubers,youtubeFetch,twitterFetch,biliFetch,fetchBeginYoutube,fetchSuccessYoutube,fetchFailureYoutube,fetchBeginTwitter,fetchSuccessTwitter,fetchFailureTwitter,fetchBeginBili,fetchSuccessBili,fetchFailureBili,user.googleapikey,user.twitterapikey);
      /*
      fetchChannelsBegin();//image begin
      var youtubeIds = vtubers.filter((vtuber) => {return subscriptions.indexOf(vtuber.enname) >= 0}).map(vtuber => vtuber.youtubeId);//list of subscribed vtuber's youtubeId
      axios.all(youtubeIds.map(youtubeId =>
        axios.get( youtubeurl + "/channels", {
          params: {
            part: "snippet",
            key: key,
            id:  youtubeId
          }
        })
      ))
      .then(axios.spread(function (...responses) {
        var input = [];
        responses.forEach(res =>{
          for (var i = 0; i < res.data.items.length; i++){
            input.push({
              enname: vtubers.filter((vtuber)=>{return vtuber.youtubeId == res.data.items[i].id})[0].enname,
              id: res.data.items[i].id,
              title: res.data.items[i].snippet.title,
              description: res.data.items[i].snippet.description,
              image: res.data.items[i].snippet.thumbnails.high.url,
            });
          }
        })
        fetchChannelsSuccess(input);//image success
      }))
      .catch((err) => {
        console.log(err);
        fetchChannelsFailure();//image failure
      });
      */
      fetchVtubersSuccess(input);//vtuber success
    })
    .catch((err) => {
      console.log(err);
      fetchVtubersFailure();//vtuber failure
    });
  }
}


export function imageFetch(vtubers,youtubeFetch,twitterFetch,biliFetch,fetchBeginYoutube,fetchSuccessYoutube,fetchFailureYoutube,fetchBeginTwitter,fetchSuccessTwitter,fetchFailureTwitter,fetchBeginBili,fetchSuccessBili,fetchFailureBili,googleapikey="",twitterapikey={key:"",secretKey:"",token:"",secretToken:""}){
  /*
  To fetch profile image of vtubers
  In:
    vtubers: list of vtubers's object
    Fetch function x3
    Begin, Success, Failure function x3
  Out:
    successAction(list of object) x n
    -or-
    failureAction() x 3 - n
  */
  var vtubersIdYoutube = [];
  var vtubersEnnameYoutube = {};
  var vtubersIdTwitter = [];
  var vtubersEnnameTwitter = {};
  var vtubersIdBili = [];
  var vtubersEnnameBili = {};
  vtubers.forEach((item) =>{
    if(item.thumbnailSource==='youtube'){
      vtubersIdYoutube.push(item.youtubeId);//get list of youtube id
      vtubersEnnameYoutube[item.youtubeId]=item.enname;//get dict = {id:name,...}
    }else if(item.thumbnailSource==='twitter'){
      vtubersIdTwitter.push(item.twitterId);//get list of twitter id
      vtubersEnnameTwitter[item.twitterId]=item.enname;//get dict = {id:name,...}
    }else if(item.thumbnailSource==='bilibili'){
      vtubersIdBili.push(item.biliId);//get list of mid
      vtubersEnnameBili[item.biliId]=item.enname;//get dict = {id:name,...}
    }
  });
  if(vtubersIdYoutube.length > 0){//if there is something to fetch
    if(googleapikey !== ""){//if user set up api key
      youtubeFetch(vtubersIdYoutube,vtubersEnnameYoutube,fetchBeginYoutube,fetchSuccessYoutube,fetchFailureYoutube, googleapikey);//fetch images
    }else{
      youtubeFetch(vtubersIdYoutube,vtubersEnnameYoutube,fetchBeginYoutube,fetchSuccessYoutube,fetchFailureYoutube);//fetch images
    }
  }
  if(vtubersIdTwitter.length > 0){//if there is something to fetch
    if(twitterapikey.key!==""&&twitterapikey.secretKey!==""&&twitterapikey.token!==""&&twitterapikey.secretToken!==""){//if user set up api key
      twitterFetch(vtubersIdTwitter,vtubersEnnameTwitter,fetchBeginTwitter,fetchSuccessTwitter,fetchFailureTwitter,twitterapikey.key,twitterapikey.secretKey,twitterapikey.token,twitterapikey.secretToken);//fetch images
    }else{
      twitterFetch(vtubersIdTwitter,vtubersEnnameTwitter,fetchBeginTwitter,fetchSuccessTwitter,fetchFailureTwitter);//fetch images
    }
  }
  if(vtubersIdBili.length > 0){//if there is something to fetch
    biliFetch(vtubersIdBili,vtubersEnnameBili,fetchBeginBili,fetchSuccessBili,fetchFailureBili);//fetch images
  }
}
