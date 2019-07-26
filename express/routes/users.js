var express = require('express'),
  router = express.Router(),
  user = require('../models/user');
var mongoose = require('mongoose');

//TODO / GET passwrod
// DELETE
// POST return true flase
router.get('/', function (req, res) {
  /*
  GET ./api/users?name=fish
  Return [{name,twitterapikey,googleapikey,groups,subscriptions}]
  */
  if (req.query && req.query.name){
    var query = user.find(req.query);
    query.exec({},(err,result)=>{
      if (err){
        res.status(404).send({ message: "name not found", data: [] });
      }else{
        res.status(200).send({ message: "OK", data: result.map((item)=>{return {
          name: item.name,
          twitterapikey: item.twitterapikey,
          googleapikey: item.googleapikey,
          groups: item.groups,
          subscriptions: item.subscriptions,
        }})});
      }
    })
  }else{
    res.status(500).send({ message: "name: xxx", data: [] });
  }
});

router.post('/', function (req, res){
  /*
  POST ./api/users
    body:{name,password}
  Return [{name,passsword, twitterapikey,googleapikey,groups,subscriptions}]
  */
  var name = req.body.name;
  var password = req.body.password;
  if (name && password) {
    var msg = new user({
      name: name,
      password: password,
      twitterapikey: "",
      googleapikey: "",
      subscriptions: [],
      groups: [],
    })
    msg.save({},(err,doc) => {
      if (err){
        res.status(500).send({ message: "name exist", data: [] });
      }else{
        res.status(201).send({ message: "OK", data: doc });
      }
    });
  }else{
    res.status(500).send({ message: "must have name and password", data: [] });
  }
});

router.get('/login', function (req, res) {
  /*
  GET ./api/login?name=fish&password=123
  Return {name,passsword, twitterapikey,googleapikey,groups,subscriptions}
  */
  if (req.query && req.query.name && req.query.password){
    var query = user.find({ name: req.query.name });
    query.exec({},(err,result)=>{
      if (err || result.length === 0){
        res.status(404).send({ message: "name not found", data: null });
      }else{
        if(result[0].password === req.query.password){
          res.status(200).send({ message: "OK", data:  {
            name: result[0].name,
            password:  result[0].password,
            twitterapikey: result[0].twitterapikey,
            googleapikey: result[0].googleapikey,
            groups: result[0].groups,
            subscriptions: result[0].subscriptions,
          }})
        }else{
          res.status(500).send({ message: "wrong password", data: null });
        }
      }
    })
  }else{
    res.status(500).send({ message: "name: xxx, password: xxx", data: null });
  }
});

router.put('/password', function (req, res) {
  /*
  PUT ./api/password?name=fish&password=123
    body:{newpassword}
  Return true
  */
  if (req.query && req.body && req.query.name && req.query.password && req.body.newpassword){
    user.update({name: req.query.name, password: req.query.password},
      {password: req.body.newpassword},
      (err, affected, resp) => {
        if(affected.n > 0){
          res.status(200).send({ message: "OK", data: true });
        }else{
          res.status(404).send({ message: "name,password error", data: false });
        }
      })
  }else{
    res.status(500).send({ message: "name: xxx, password: xxx, newpassword: xxx", data: false });
  }
});

router.put('/subscriptions', function (req, res) {
  /*
  PUT ./api/subscriptions?name=fish&password=123
    body:subscriptions
  Return true
  */
  if (req.query && req.body && req.query.name && req.query.password && req.body.subscriptions){
    user.findOneAndUpdate(
      {name: req.query.name,password: req.query.password},
      {subscriptions: req.body.subscriptions},
      (err)=>{
        if(err){
          res.status(404).send({ message: "name not found", data: false });
        }else{
          res.status(200).send({ message: "OK", data: true });
        }
      }
    );
  }else{
    res.status(500).send({ message: "name: xxx, password: xxx, subscriptions: [xxx]", data: false });
  }
});

router.put('/groups', function (req, res) {
  /*
  PUT ./api/groups?name=fish&password=123
    body:groups
  Return true
  */
  if (req.query && req.body && req.query.name && req.query.password && req.body.groups){
    user.findOneAndUpdate(
      {name: req.query.name,password: req.query.password},
      {groups: req.body.groups},
      (err)=>{
        if(err){
          res.status(404).send({ message: "name not found", data: false });
        }else{
          res.status(200).send({ message: "OK", data: true });
        }
      }
    );
  }else{
    res.status(500).send({ message: "name: xxx, password: xxx, groups: [xxx]", data: false });
  }
});

router.put('/twitterapikey', function (req, res) {
  /*
  PUT ./api/twitterapikey?name=fish&password=123
    body:twitterapikey
  Return true
  */
  if (req.query && req.body && req.query.name && req.query.password && req.body.twitterapikey){
    user.findOneAndUpdate(
      {name: req.query.name,password: req.query.password},
      {twitterapikey: req.body.twitterapikey},
      (err)=>{
        if(err){
          res.status(404).send({ message: "name not found", data: {status: false} });
        }else{
          res.status(200).send({ message: "OK", data: {status: true, data: {name: req.query.name, twitterapikey: req.body.twitterapikey}}});
        }
      }
    );
  }else{
    res.status(500).send({ message: "name: xxx, password: xxx, twitterapikey: xxx", data: {status: false} });
  }
});

router.put('/googleapikey', function (req, res) {
  /*
  PUT ./api/youtubeapikey?name=fish&password=123
    body:youtubeapikey
  Return true
  */
  if (req.query && req.body && req.query.name && req.query.password && req.body.googleapikey){
    user.findOneAndUpdate(
      {name: req.query.name,password: req.query.password},
      {googleapikey: req.body.googleapikey},
      (err)=>{
        if(err){
          res.status(404).send({ message: "name not found", data: {status: false} });
        }else{
          res.status(200).send({ message: "OK", data: {status: true, data: {name: req.query.name, googleapikey: req.body.googleapikey}}});
        }
      }
    );
  }else{
    res.status(500).send({ message: "name: xxx, password: xxx, googleapikey: xxx", data: {status: false} });
  }
});

module.exports = router;
