import axios from 'axios';

const url = "https://daredemodaisuki.herokuapp.com/api";

export function getSuggestions(enname, suggestedBy, fetchBegin, fetchSuccess,fetchFailure){
  /*
  API Call to https://daredemodaisuki.herokuapp.com/api/suggestions
  In:
    enname: String of enname of Vtuber
    suggestedBy: String of username
    Begin,Success,Failure Actions
  Out:
    successAction(object)
    -or-
    failureAction()
  */
  fetchBegin();//begin
  axios.get(url + '/suggestions',{
    params:{
      enname: enname,
      suggestedBy: suggestedBy
    }
  })
  .then((res)=>{
    var input = res.data.data[0];
    fetchSuccess(input);//success
  })
  .catch((err) => {
    console.log(err);
    fetchFailure();//failure
  });
}

export function getAllSuggestions(ennames, suggestedBy, fetchBegin, fetchSuccess, fetchFailure){
  /*
  API Call to https://daredemodaisuki.herokuapp.com/api/suggestions
  In:
    ennames: List of ennames of Vtuber
    suggestedBy: String of username
    Begin,Success,Failure Actions
  Out:
    successAction(object)
    -or-
    failureAction()
  */
  fetchBegin();//begin
  var strnames = "";
  ennames.forEach((enname)=>{
    strnames += enname + ",";
  });//map ennames to a string e.g. "Shirakami Fubuki,Minato Aqua,"
  strnames = strnames.substring(0,strnames.length - 1);//remove the last comma
  axios.get(url + '/suggestions',{
    params:{
      ennames: strnames,
      suggestedBy: suggestedBy,
    }
  })
  .then((res)=>{
    var input = res.data.data;
    fetchSuccess(input);//success
  })
  .catch((err) => {
    console.log(err);
    fetchFailure();//failure
  });
}

export function postSuggestions(password, suggestedBy, createdAt, name, enname, youtubeId, twitterId, biliId, tags, thumbnailSource, fetchBegin, fetchSuccess,fetchFailure){
  /*
  API Call to https://daredemodaisuki.herokuapp.com/api/suggestions
  In:
    password: String of user password
    suggestedBy: String of username
    createdAt: Date of created time
    name: String of vtuber name
    enname: String of vtuber enname
    youtubeId: String of vtuber youtubeId
    twitterId: String of vtuber twitterId
    biliId: String of vtuber biliId
    tags: [String] of vtuber tags
    thumbnailSource: String of vtuber thumbnailSource
    Begin,Success,Failure Actions
  Out:
    successAction()
    -or-
    failureAction()
  */
  fetchBegin();//begin
  axios.post(url + '/suggestions',{
    password: password,
    suggestedBy: suggestedBy,
    createdAt: createdAt,
    name: name,
    enname: enname,
    youtubeId: youtubeId,
    twitterId: twitterId,
    biliId: biliId,
    tags: tags,
    thumbnailSource: thumbnailSource,
  })
  .then((res)=>{
    var input = res.data.data;
    if (input){
      fetchSuccess(input);//success
    }else {
      fetchFailure();//failure
    }
  })
  .catch((err) => {
    console.log(err);
    fetchFailure();//failure
  });
}

export function addTags(name, password, enname, tags, fetchBegin, fetchSuccess,fetchFailure){
  /*
  API Call to https://daredemodaisuki.herokuapp.com/api/suggestions/addTags
  In:
    name: String of user name
    password: String of user password
    enname: String of vtuber enname
    tags: [String] of vtuber tags
    Begin,Success,Failure Actions
  Out:
    successAction()
    -or-
    failureAction()
  */
  fetchBegin();//begin
  axios.put(url + '/suggestions/addTags?enname=' + enname + '&name=' + name + '&password=' + password,{
    tags: tags,
  })
  .then((res)=>{
    var input = res.data.data;
    if (input){
      fetchSuccess(input);//success
    }else {
      fetchFailure();//failure
    }
  })
  .catch((err) => {
    console.log(err);
    fetchFailure();//failure
  });
}

export function removeTags(name, password, enname, tags, fetchBegin, fetchSuccess,fetchFailure){
  /*
  API Call to https://daredemodaisuki.herokuapp.com/api/suggestions/addTags
  In:
    name: String of user name
    password: String of user password
    enname: String of vtuber enname
    tags: [String] of vtuber tags
    Begin,Success,Failure Actions
  Out:
    successAction()
    -or-
    failureAction()
  */
  fetchBegin();//begin
  axios.put(url + '/suggestions/removeTags?enname=' + enname + '&name=' + name + '&password=' + password,{
    tags: tags,
  })
  .then((res)=>{
    var input = res.data.data;
    if (input){
      fetchSuccess(input);//success
    }else {
      fetchFailure();//failure
    }
  })
  .catch((err) => {
    console.log(err);
    fetchFailure();//failure
  });
}
