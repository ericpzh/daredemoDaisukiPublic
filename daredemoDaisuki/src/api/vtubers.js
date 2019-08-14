import axios from 'axios';

//const url = "https://daredemodaisuki.herokuapp.com/api";
const url = "http://daredemodaisuki.web.illinois.edu/api";

export function getVtubers(enname, fetchBegin, fetchSuccess,fetchFailure){
  /*
  API Call to https://daredemodaisuki.herokuapp.com/api/vtubers
  In:
    enname: String of enname of Vtuber
    Begin,Success,Failure Actions
  Out:
    successAction(object)
    -or-
    failureAction()
  */
  fetchBegin();//begin
  axios.get(url + '/vtubers',{
    params:{
      enname: enname,
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

export function getAllVtubers(ennames, fetchBegin, fetchSuccess,fetchFailure){
  /*
  API Call to https://daredemodaisuki.herokuapp.com/api/vtubers
  In:
    ennames: List of ennames of Vtuber
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
  axios.get(url + '/vtubers',{
    params:{
      ennames: strnames,
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

export function getAll(fetchBegin, fetchSuccess,fetchFailure, subscriptions=[], page=0){
  /*
  API Call to https://daredemodaisuki.herokuapp.com/api/vtubers/all
  In:
    subscriptions: list of ennames
    page: int of page number
    Begin,Success,Failure Actions
  Out:
    successAction(list of object)
    -or-
    failureAction()
  */
  fetchBegin();//begin
  var subscriptionsstr = "";
  subscriptions.forEach((sub)=>{
    subscriptionsstr += sub + ",";
  });//map subscriptions to a string e.g. "Shirakami Fubuki,Minato Aqua,"
  subscriptionsstr = subscriptionsstr.substring(0,subscriptionsstr.length-1);//remove the last comma
  axios.get(url + '/vtubers/all',{
    params:{
      page: page,
      subscriptions: subscriptionsstr
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

export function queryVtubers(query, fetchBegin, fetchSuccess,fetchFailure){
  /*
  API Call to https://daredemodaisuki.herokuapp.com/api/vtubers/query
  In:
    query: String to query
    Begin,Success,Failure Actions
  Out:
    successAction(list of object)
    -or-
    failureAction()
  */
  fetchBegin();//begin
  axios.get(url + '/vtubers/query',{
    params:{
      query: query,
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
