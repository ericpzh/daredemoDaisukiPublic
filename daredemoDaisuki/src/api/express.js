import axios from 'axios';

const url = "https://daredemodaisuki.herokuapp.com/api";

//TODO: merge callback arg to successAction
export function getAccount(name, fetchAccountBegin, fetchAccountSuccess,fetchAccountFailure){
  /*
  API Call to https://daredemodaisuki.herokuapp.com/api/users
  In:
    name: String of username
    Begin,Success,Failure Actions
  Out:
    successAction(object)
    -or-
    failureAction()
  */
  fetchAccountBegin();//begin
  axios.get(url + '/users',{
    params:{
      name: name,
    }
  })
  .then((res)=>{
    var input = res.data.data[0];//data
    fetchAccountSuccess(input);//success
  })
  .catch((err) => {
    console.log(err);
    fetchAccountFailure();//failure
  });
}

export function postAccount(name, password, postAccountBegin, postAccountSuccess, postAccountFailure){
  /*
  API Call to https://daredemodaisuki.herokuapp.com/api/users
  In:
    name: String of username
    password: String of password
    Begin,Success,Failure Actions
  Out:
    successAction()
    -or-
    failureAction()
  */
  postAccountBegin();//begin
  axios.post(url + '/users',{
    name: name,
    password: password,
  })
  .then((res)=>{
    var input = res.data.data;
    if (input){
      postAccountSuccess(input);//success
    }else {
      postAccountFailure();//failure
    }
  })
  .catch((err) => {
    console.log(err);
    postAccountFailure();//failure
  });
}

export function login(name, password, loginBegin, loginSuccess, loginFailure){
  /*
  API Call to https://daredemodaisuki.herokuapp.com/api/users/login
  In:
    name: String of username
    password: String of password
    Begin,Success,Failure Actions
  Out:
    successAction()
    -or-
    failureAction()
  */
  loginBegin();//begin
  axios.get(url + '/users/login',{
    params:{
      name: name,
      password: password,
    }
  })
  .then((res)=>{
    var input = res.data.data;
    if (input) {
      loginSuccess(input);//success
    } else {
      loginFailure();//failure
    }
  })
  .catch((err) => {
    console.log(err);
    loginFailure();//failure
  });
}

export function putPassword(name, password, newpassword, putPasswordBegin, putPasswordSuccess, putPasswordFailure){
  /*
  API Call to https://daredemodaisuki.herokuapp.com/api/users/password
  In:
    name: String of username
    password: String of password
    newpassword: String of newpassword
    Begin,Success,Failure Actions
  Out:
    successAction()
    -or-
    failureAction()
  */
  putPasswordBegin();//begin
  axios.put(url + '/users/password' + '?name=' + name + '&password=' + password , {
    newpassword: newpassword,
  })
  .then((res)=>{
    var input = res.data.data;
    if(input){
      putPasswordSuccess(newpassword);//success
    }else{
      putPasswordFailure();//failure
    }
  })
  .catch((err) => {
    console.log(err);
    putPasswordFailure();//failure
  });
}

export function putSubscriptions(name, password, subscriptions, putSubscriptionsBegin, putSubscriptionsSuccess, putSubscriptionsFailure, callback, enname){
  /*
  API Call to https://daredemodaisuki.herokuapp.com/api/users/subscriptions
  In:
    name: String of username
    password: String of password
    subscriptions: list of ennames
    callback: addtional callback function for other store, e.g.searchVtuberRemove()
    enname: enname of changed vtuber
    Begin,Success,Failure Actions
  Out:
    successAction(subscriptions,enname)
    -or-
    failureAction()
  */
  putSubscriptionsBegin(enname);//begin
  axios.put(url + '/users/subscriptions' + '?name=' + name + '&password=' + password , {
    subscriptions: subscriptions,
  })
  .then((res)=>{
    var input = res.data.data;
    if(input){
      putSubscriptionsSuccess(subscriptions,enname);//success
      callback(enname);//success
    }else{
      putSubscriptionsFailure(enname);//failure
    }
  })
  .catch((err) => {
    console.log(err);
    putSubscriptionsFailure(enname);//failure
  });
}

export function putGroups(name, password, groups, putGroupsBegin, putGroupsSuccess, putGroupsFailure){
  /*
  API Call to https://daredemodaisuki.herokuapp.com/api/users/groups
  In:
    name: String of username
    password: String of password
    groups: {neko:["Shirakami Fubuki",...],...}
    Begin,Success,Failure Actions
  Out:
    successAction()
    -or-
    failureAction()
  */
  putGroupsBegin();//begin
  axios.put(url + '/users/groups' + '?name=' + name + '&password=' + password , {
    groups: groups,
  })
  .then((res)=>{
    var input = res.data.data;
    if(input){
      putGroupsSuccess(groups);//success
    }else{
      putGroupsFailure();//failure
    }
  })
  .catch((err) => {
    console.log(err);
    putGroupsFailure();//failure
  });
}

export function putTwitterapikey(name, password, twitterapikey, putTwitterapikeyBegin, putTwitterapikeySuccess, putTwitterapikeyFailure){
  /*
  API Call to https://daredemodaisuki.herokuapp.com/api/users/twitterapikey
  In:
    name: String of username
    password: String of password
    twitterapikey: String of apikey
    Begin,Success,Failure Actions
  Out:
    successAction()
    -or-
    failureAction()
  */
  putTwitterapikeyBegin();//begin
  axios.put(url + '/users/twitterapikey' + '?name=' + name + '&password=' + password , {
    twitterapikey: twitterapikey,
  })
  .then((res)=>{
    var input = res.data.data;
    if(input.status){
      putTwitterapikeySuccess(input.data.twitterapikey);//success
    }else{
      putTwitterapikeyFailure();//failure
    }
  })
  .catch((err) => {
    console.log(err);
    putTwitterapikeyFailure();//failure
  });
}

export function putGoogleapikey(name, password, googleapikey, putGoogleapikeyBegin, putGoogleapikeySuccess, putGoogleapikeyFailure){
  /*
  API Call to https://daredemodaisuki.herokuapp.com/api/users/googleapikey
  In:
    name: String of username
    password: String of password
    googleapikey: String of googleapikey
    Begin,Success,Failure Actions
  Out:
    successAction()
    -or-
    failureAction()
  */
  putGoogleapikeyBegin();//begin
  axios.put(url + '/users/googleapikey' + '?name=' + name + '&password=' + password , {
    googleapikey: googleapikey,
  })
  .then((res)=>{
    var input = res.data.data;
    if(input.status){
      putGoogleapikeySuccess(input.data.googleapikey);//success
    }else{
      putGoogleapikeyFailure();//failure
    }
  })
  .catch((err) => {
    console.log(err);
    putGoogleapikeyFailure();//failure
  });
}
