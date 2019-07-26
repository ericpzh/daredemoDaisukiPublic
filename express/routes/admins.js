var express = require('express'),
  router = express.Router(),
  secrets = require('../config/secrets'),
  admin = require('../models/admin');
var mongoose = require('mongoose');

router.get('/', function (req, res) {
  /*
  GET ./api/admins?name=fish
  Return [{names}]
  */
  if (req.query && req.query.name){
    var query = admin.find(req.query);
    query.exec({},(err,result)=>{
      if (err){
        res.status(404).send({ message: "name not found", data: [] });
      }else{
        res.status(200).send({ message: "OK", data: result.map((item)=>{return {
          name: item.name,
        }})});
      }
    })
  }else{
    res.status(500).send({ message: "name: xxx", data: [] });
  }
});

router.post('/', function (req, res){
  /*
  POST ./api/admins
    body:{name,password,token}

  Return [{name,password,token}
]
  */
  var name = req.body.name;
  var password = req.body.password;
  var token = req.body.token;
  if (name && password && token) {
    if(secrets.token === token){
      var msg = new admin({
        name: name,
        password: password,
        token: token,
      })
      msg.save({},(err,doc) => {
        if (err){
          res.status(500).send({ message: "name exist", data: null });
        }else{
          res.status(201).send({ message: "OK", data: doc });
        }
      });
    }else{
      res.status(500).send({ message: "bad token", data: null });
    }
  }else{
    res.status(500).send({ message: "must have name and password and token", data: null });
  }
});

router.get('/login', function (req, res) {
  /*
  GET ./api/login?name=fish&password=123
  Return {name,password,token}

  */
  if (req.query && req.query.name && req.query.password){
    var query = admin.find({ name: req.query.name });
    query.exec({},(err,result)=>{
      if (err || result.length === 0){
        res.status(404).send({ message: "name not found", data: null });
      }else{
        if(result[0].password === req.query.password){
          res.status(200).send({ message: "OK", data:  {
            name: result[0].name,
            password:  result[0].password,
            token: result[0].token,
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
    admin.update({name: req.query.name, password: req.query.password},
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

module.exports = router;
