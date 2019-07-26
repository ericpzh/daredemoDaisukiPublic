import axios from 'axios';

const url = "https://api.bilibili.com";
const videourl = "https://www.bilibili.com/video/av";

/*
TODO: add delay when fetch
*/
export function getAccount(subscriptions, vtubersDict, fetchAccountBegin, fetchAccountSuccess,fetchAccountFailure){
  /*
  API Call to https://api.bilibili.com/x/space/acc/info?mid=123
  In:
    subscriptions: array of ennames
    vtubersDict: dictionary of {enname:{...,biliId:"233",...}}
    Begin,Success,Failure Actions
  Out:
    successAction(array of object)
    -or-
    failureAction()
  */
  fetchAccountBegin();
  var biliIds = subscriptions.map(vtuber=>vtubersDict[vtuber].biliId);//list of subscribed biliIds
  var ennames = subscriptions.map(vtuber=>vtubersDict[vtuber].enname);//list of subscribed ennames
  axios.all(biliIds.map(biliId =>
    axios.get( url + "/x/space/acc/info", {
      params: {
        mid: biliId,
      }
    })
  ))
  .then(axios.spread(function (...responses) {
    var input = [];
    for (var i = 0; i < responses.length; i++){
      var res = responses[i];
      input.push({
        enname: ennames[i],
        mid: res.data.data.mid,
        name: res.data.data.name,
        image: res.data.data.face,
        description: res.data.data.sign,
        banner: res.data.data.top_photo,
      });
    }
    fetchAccountSuccess(input);
  }))
  .catch((err) => {
    console.log(err);
    fetchAccountFailure();
  });
}

export function getLiveAccount(subscriptions, vtubersDict, fetchLiveBegin, fetchLiveSuccess,fetchLiveFailure){
  /*
  API Call to https://api.live.bilibili.com/room/v1/Room/getRoomInfoOld?mid=123
  In:
    subscriptions: array of ennames
    vtubersDict: dictionary of {enname:{...,biliId:"233",...}}
    Begin,Success,Failure Actions
  Out:
    successAction(array of object)
    -or-
    failureAction()
  */
  fetchLiveBegin();
  var biliIds = subscriptions.map(vtuber=>vtubersDict[vtuber].biliId);//list of subscribed biliIds
  axios.all(biliIds.map(biliId =>
    axios.get("https://api.live.bilibili.com/room/v1/Room/getRoomInfoOld", {
      params: {
        mid: biliId,
      }
    })
  ))
  .then(axios.spread(function (...responses) {
    var input = [];
    for (var i = 0; i < responses.length; i++){
      var res = responses[i];
      input.push({
        mid: biliIds[i],
        roomid: res.data.data.roomid,
        url: res.data.data.url,
        title: res.data.data.title,
        liveStatus: res.data.data.liveStatus,
        banner: res.data.data.cover,
      });
    }
    fetchLiveSuccess(input);
  }))
  .catch((err) => {
    console.log(err);
    fetchLiveFailure();
  });
}

export function getVideo(aid, fetchVideoBegin, fetchVideoSuccess, fetchVideoFailure){
  /*
  API Call to https://api.bilibili.com/x/web-interface/view?aid=123
  In:
    aid: "233"
    Begin,Success,Failure Actions
  Out:
    successAction(array of object)
    -or-
    failureAction()
  */
  fetchVideoBegin();
  axios.get( url + "/x/web-interface/view", {
    params: {
      aid: aid,
    }
  })
  .then((res)=>{
    var input = [];
    input.push({
      aid: res.data.data.aid,
      title: res.data.data.title,
      image: res.data.data.pic,
      time: new Date(parseInt(res.data.data.pubdate.toString()+"000")),
      description: res.data.data.desc,
      vtubername: res.data.data.owner.name,
      vtuberimage: res.data.data.owner.face,
      mid: res.data.data.owner.mid,
    });
    fetchVideoSuccess(input);
  })
  .catch((err) => {
    fetchVideoFailure();
    console.log(err);
  });
}

export function queryVideo(keyword, fetchVideoBegin, fetchVideoSuccess, fetchVideoFailure, page=1){
  /*
  API Call to https://api.bilibili.com/x/web-interface/search/type
  In:
    keyword: "aqua"
    page: 1
    Begin,Success,Failure Actions
  Out:
    successAction(array of object)
    -or-
    failureAction()
  */
  fetchVideoBegin();
  axios.get( url + "/x/web-interface/search/type", {
    params: {
      jsonp: 'jsonp',
      search_type: 'video',
      keyword: keyword,
      order: 'click',
      page: page,
    }
  })
  .then((res)=>{
    var input = [];
    res.data.data.result.forEach((data)=>{
      var date = new Date(parseInt(data.pubdate.toString()+"000"));
      input.push({
        tag: data.tag,
        aid: data.aid,
        title: data.title.replace('<em class=\"keyword\">','').replace('</em>',''),
        image: 'https:' + data.pic,
        time: date,
        displaytime: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate())  + ' ' +  (date.getHours().toString().length === 1?"0"+date.getHours().toString():date.getHours().toString()) + ':' + (date.getMinutes().toString().length === 1?"0"+date.getMinutes().toString():date.getMinutes().toString()),
        description: data.description,
        name: data.author,
        type: data.typename,
        mid: data.mid,
        url: data.arcurl
      });
    })
    fetchVideoSuccess(input);
  })
  .catch((err) => {
    fetchVideoFailure();
    console.log(err);
  });
}

export function getAccountById(biliIds, ennames, fetchAccountBegin, fetchAccountSuccess,fetchAccountFailure){
  /*
  API Call to https://api.bilibili.com/x/space/acc/info?mid=123
  In:
    biliIds: array of mids
    ennames: dict of {id:enname}
    Begin,Success,Failure Actions
  Out:
    successAction(array of object)
    -or-
    failureAction()
  */
  fetchAccountBegin();
  axios.all(biliIds.map(biliId =>
    axios.get( url + "/x/space/acc/info", {
      params: {
        mid: biliId,
      }
    })
  ))
  .then(axios.spread(function (...responses) {
    var input = [];
    for (var i = 0; i < responses.length; i++){
      var res = responses[i];
      input.push({
        enname: ennames[res.data.data.mid],
        mid: res.data.data.mid,
        name: res.data.data.name,
        image: res.data.data.face,
        description: res.data.data.sign,
        banner: res.data.data.top_photo,
      });
    }
    fetchAccountSuccess(input);
  }))
  .catch((err) => {
    console.log(err);
    fetchAccountFailure();
  });
}

//require key: get .flv downlad: api.bilibili.com/x/playerurl?avid=41517911&cid=72913641
export function getSubmitVideos(subscriptions, vtubersDict,  fetchBegin, fetchSuccess,fetchFailure, page=1, pagesize=10){
  /*
  API Call to https://space.bilibili.com/ajax/member/getSubmitVideos
  In:
    biliId: list of mids
    Begin,Success,Failure Actions
  Out:
    successAction(array of object)
    -or-
    failureAction()
  */
  var biliIds = subscriptions.map(vtuber=>vtubersDict[vtuber].biliId);//list of subscribed biliIds
  fetchBegin();
  axios.all(biliIds.map(biliId =>
    axios.get( 'https://space.bilibili.com/ajax/member/getSubmitVideos', {
      params: {
        mid: biliId,
        pagesize: pagesize,
        page: page,
      }
    })
  ))
  .then(axios.spread(function (...responses) {
    var input = [];
    for (var i = 0; i < responses.length; i++){
      var res = responses[i].data.data.vlist;
      res.forEach(data=>{
        var date = new Date(parseInt(data.created.toString()+"000"));
        input.push({
          mid: data.mid,
          aid: data.aid,
          title: data.title,
          image: 'https:' + data.pic,
          name: data.author,
          time: date,
          displaytime: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate())  + ' ' +  (date.getHours().toString().length === 1?"0"+date.getHours().toString():date.getHours().toString()) + ':' + (date.getMinutes().toString().length === 1?"0"+date.getMinutes().toString():date.getMinutes().toString()),
          description: data.description,
        });
      })
    }
    fetchSuccess(input);
  }))
  .catch((err) => {
    console.log(err);
    fetchFailure();
  });
}
