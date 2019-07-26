var express = require('express'),
  router = express.Router(),
  secrets = require('../config/secrets'),
  user = require('../models/user'),
  vtuber = require('../models/vtuber'),
  pendingVtuber = require('../models/pendingVtuber');
var mongoose = require('mongoose');

router.get('/random', function (req, res) {
  /*
  GET .../api/suggestions/random
  Return {name,enname,youtubeId,twitterId,biliId,tags,thumbnailSource,suggestedBy,createdAt}
  */
  pendingVtuber.count().exec(function(err, count){
    var random = Math.floor(Math.random() * count);
    pendingVtuber.findOne().skip(random).exec(
      function (err, result) {
        if (err){
          res.status(404).send({ message: "empty database", data: null });
        }else{
          try{
              res.status(200).send({ message: "OK", data:
              {
                suggestedBy: result.suggestedBy,
                createdAt: result.createdAt,
                name: result.name,
                enname: result.enname,
                youtubeId: result.youtubeId,
                twitterId: result.twitterId,
                biliId: result.biliId,
                tags: result.tags,
                thumbnailSource: result.thumbnailSource,
              }
            })
          }catch (e){
            console.log(e);
            res.status(404).send({ message: "empty database", data: null });
          }
        }
      });
  });
})

router.get('/', function (req, res) {
  /*
  GET .../api/suggestions?enname=Shirakami Fubuki&suggestedBy=fish
  Return [{name,enname,youtubeId,twitterId,biliId,tags,thumbnailSource,suggestedBy,createdAt}]
  GET .../api/suggestions?ennames=Shirakami Fubuki,Minato Aqua
  Return [{name,enname,youtubeId,twitterId,biliId,tags,thumbnailSource,suggestedBy,createdAt},...]
  */
  if (req.query && req.query.enname && req.query.suggestedBy){//get one
    var query = pendingVtuber.find({
      enname: req.query.enname,
      suggestedBy: req.query.suggestedBy
    });
    query.exec({},(err,result)=>{
      if (err){
        res.status(404).send({ message: "suggestedBy & enname not found", data: [] });
      }else{
        res.status(200).send({ message: "OK", data: result.map((item)=>{return {
          suggestedBy: item.suggestedBy,
          createdAt: item.createdAt,
          name: item.name,
          enname: item.enname,
          youtubeId: item.youtubeId,
          twitterId: item.twitterId,
          biliId: item.biliId,
          tags: item.tags,
          thumbnailSource: item.thumbnailSource,
        }})});
      }
    })
  }else if(req.query && req.query.ennames && req.query.suggestedBy){//get many
    var ennames = req.query.ennames.split(',');
    var query = pendingVtuber.find({
      enname: {$in: ennames},
      suggestedBy: req.query.suggestedBy
    });
    query.exec({},(err,result)=>{
      if (err){
        res.status(404).send({ message: "suggestedBy & enname not found", data: [] });
      }else{
        res.status(200).send({ message: "OK", data: result.map((item)=>{return {
          suggestedBy: item.suggestedBy,
          createdAt: item.createdAt,
          name: item.name,
          enname: item.enname,
          youtubeId: item.youtubeId,
          twitterId: item.twitterId,
          biliId: item.biliId,
          tags: item.tags,
          thumbnailSource: item.thumbnailSource,
        }})});
      }
    })
  }else{
    res.status(500).send({ message: "createdAt:xxx,suggestedBy:xxx,enname: xxx or ennames:xxx,xxx", data: [] });
  }
});

router.get('/all', function (req, res) {
  /*
  GET .../api/suggestions/all(?page=0&subscriptions=Shirakami Fubuki,Minato Aqua)
  Return [{name,enname,youtubeId,twitterId,biliId,tags,thumbnailSource,suggestedBy,createdAt},...]
  */
  const perpage = 10;
  var page = req.query.page?req.query.page:0;
  var subscriptions = req.query.subscriptions?req.query.subscriptions.split(','):[];
  var query = pendingVtuber.find({ "enname": { "$nin": subscriptions } }).sort('enname').skip(page*perpage).limit(perpage);
  query.exec({},(err,result)=>{
    if (err){
      res.status(404).send({ message: "error", data: [] });
    }else{
      res.status(200).send({ message: "OK", data: result.map((item)=>{return {
        suggestedBy: item.suggestedBy,
        createdAt: item.createdAt,
        name: item.name,
        enname: item.enname,
        youtubeId: item.youtubeId,
        twitterId: item.twitterId,
        biliId: item.biliId,
        tags: item.tags,
        thumbnailSource: item.thumbnailSource,
      }})});
    }
  })
});

router.get('/query', function (req, res) {
  /*
  GET .../api/suggestions/query?query=fubuki
  Return [{name,enname,youtubeId,twitterId,biliId,tags,thumbnailSource,suggestedBy,createdAt},...]
  */
  if (req.query && req.query.query){
    var query = pendingVtuber.find({ $or:
      [{ "name": { "$regex": req.query.query, "$options": "i" } },
       { "enname": { "$regex": req.query.query, "$options": "i" } }]
    });
    query.exec({},(err,result)=>{
      if (err){
        res.status(404).send({ message: "not found", data: [] });
      }else{
        res.status(200).send({ message: "OK", data: result.map((item)=>{return {
          suggestedBy: item.suggestedBy,
          createdAt: item.createdAt,
          name: item.name,
          enname: item.enname,
          youtubeId: item.youtubeId,
          twitterId: item.twitterId,
          biliId: item.biliId,
          tags: item.tags,
          thumbnailSource: item.thumbnailSource,
        }})});
      }
    })
  }else{
    res.status(500).send({ message: "query: xxx", data: [] });
  }
});


router.post('/', function (req, res){
  /*
  POST .../api/suggestions
    body:{suggestedBy,password,createdAt,name,enname,youtubeId,twitterId,biliId,tags,thumbnailSource}
  Return [{name,enname,youtubeId,twitterId,biliId,tags,thumbnailSource,suggestedBy,createdAt}]
  */
  var name = req.body.name;
  var enname = req.body.enname;
  var youtubeId = req.body.youtubeId;
  var twitterId = req.body.twitterId;
  var biliId = req.body.biliId;
  var tags = req.body.tags;
  var thumbnailSource = req.body.thumbnailSource;
  var suggestedBy = req.body.suggestedBy;
  var createdAt = req.body.createdAt;
  var password = req.body.password;
  if (suggestedBy && password && createdAt && name && enname && youtubeId && twitterId && biliId && tags && thumbnailSource) {
    user.findOne(//update suggextion of users
      {name: suggestedBy, password: password},
      (err, target) => {
        if(err || !target){
          res.status(404).send({ message: "name not found", data: null});
          return;
        }
        var newSuggestions = target.suggestions
        if (!newSuggestions.includes(enname)){
          newSuggestions.push(enname);
        }
        target.suggestions = newSuggestions;
        target.markModified('suggestions');
        target.save((err)=>{
            if(err){
              res.status(404).send({ message: "can't modify user", data: null});
            }else{
              var target = {//new obj
                suggestedBy: suggestedBy,
                createdAt: createdAt,
                name: name,
                enname: enname,
                youtubeId: youtubeId,
                twitterId: twitterId,
                biliId: biliId,
                tags: tags,
                thumbnailSource: thumbnailSource,
              }
              pendingVtuber.findOneAndUpdate(//update or insert new or old suggestiosn
                {suggestedBy: suggestedBy, enname: enname},
                target,
                { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true, overwrite: true },
                (err)=>{
                  if(err){
                    res.status(404).send({ message: "can't update pendingVtuber", data: null });
                  }else{
                    res.status(201).send({ message: "OK", data: target });
                  }
                }
              )
            }
        })
      }
    )
  }else{
    res.status(500).send({ message: "require name, enname, youtubeId, twitterId, biliId, token, suggestedBy, createdAt", data: [] });
  }
});

router.put('/', function (req, res) {
  /*
  PUT .../api/suggestions?enname=Shirakami Fubuki&token= xxx
    body:{name,youtubeId,twitterId,biliId,tags,thumbnailSource,suggestedBy,createdAt}
  Return true
  */
  if (req.query && req.body && req.body.suggestedBy && req.body.createdAt && req.query.enname && req.body.name && req.body.youtubeId && req.body.twitterId && req.body.biliId && req.body.tags && req.body.thumbnailSource && req.query.token && req.query.token === secrets.token){
    var target = {
      suggestedBy: req.body.suggestedBy,
      createdAt: req.body.createdAt,
      name: req.body.name,
      youtubeId: req.body.youtubeId,
      twitterId: req.body.twitterId,
      biliId: req.body.biliId,
      tags: req.body.tags,
      thumbnailSource: req.body.thumbnailSource,
    }
    pendingVtuber.findOneAndUpdate(
      {enname: req.query.enname,suggestedBy: req.body.suggestedBy},
      target,
      (err)=>{
        if(err){
          res.status(404).send({ message: "enname not found", data: null });
        }else{
          res.status(200).send({ message: "OK", data: target });
        }
      }
    );
  }else{
    res.status(500).send({ message: "require name, youtubeId, twitterId, biliId, token, suggestedBy, createdAt", data: null });
  }
});

router.delete('/', function (req, res) {
  /*
  DELETE .../api/suggestions?enname=Shirakami Fubuki&token=xxx&suggestedBy=Fish
  Return true
  */
  if (req.query && req.query.enname && req.query.suggestedBy && req.query.token && req.query.token === secrets.token){
    pendingVtuber.deleteOne(
      {enname: req.query.enname,suggestedBy: req.query.suggestedBy},
      (err)=>{
        if(err){
          res.status(404).send({ message: "enname not found", data: null });
        }else{
          res.status(200).send({ message: "OK", data: {enname: req.query.enname, suggestedBy: req.query.suggestedBy} });
        }
      }
    );
  }else{
    res.status(500).send({ message: "name: xxx, suggestedBy: xxx, token:xxx ", data: null });
  }
});

router.delete('/all', function (req, res) {
  /*
  DELETE .../api/suggestions/all?&token=xxx
  Return true
  */
  if (req.query.token && req.query.token === secrets.token){
    pendingVtuber.deleteMany({},(err)=>{
      res.status(200).send({ message: "OK", data: {enname:"",suggestedBy:""} });
    });
  }else{
    res.status(500).send({ message: "name: xxx, suggestedBy: xxx, token:xxx ", data: null });
  }
});

router.put('/approve', function (req, res) {
  /*
  PUT .../api/suggestions/approve?enname=Shirakami Fubuki&suggestedBy=Fish&token= xxx
  Return true
  */
  if (req.query && req.query.suggestedBy && req.query.enname && req.query.token && req.query.token === secrets.token){
    pendingVtuber.find(
      {enname: req.query.enname,suggestedBy: req.query.suggestedBy},
      (err, obj) => {
        if (err) {
          res.status(404).send({ message: "name not found", data: null });
        }else{
          var target = {
            name: obj[0].toObject().name,
            enname: req.query.enname,
            youtubeId: obj[0].toObject().youtubeId,
            twitterId:obj[0].toObject(). twitterId,
            biliId: obj[0].toObject().biliId,
            tags: obj[0].toObject().tags,
            thumbnailSource: obj[0].toObject().thumbnailSource,
          };
          vtuber.findOneAndUpdate(//update or insert vtuber
            {enname: req.query.enname},
            target,
            { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true },
            (err)=>{
              if(err){
                res.status(404).send({ message: "enname not found", data: null });
              }else{
                user.findOne(//remove from user
                  {name: req.query.suggestedBy},
                  (err, target) => {
                    if(err || !target){
                      res.status(404).send({ message: "name not found", data: null});
                      return;
                    }
                    var newSuggestions = target.suggestions.filter((suggestion)=>{
                      return req.query.enname !== suggestion;
                    });
                    target.suggestions = newSuggestions;
                    target.markModified('suggestions');
                    target.save((err)=>{
                        if(err){
                          res.status(404).send({ message: "can't update user", data: null});
                        }else{
                          pendingVtuber.deleteOne(//remove from pendingVtuber
                            {enname: req.query.enname,suggestedBy: req.query.suggestedBy},
                            (err)=>{
                              if(err){
                                res.status(404).send({ message: "can't update pendingVtuber", data: null });
                              }else{
                                res.status(200).send({ message: "OK", data: target });
                              }
                            }
                          )
                        }
                    })
                  }
                );
              }
            }
          );
        }
    })
  }else{
    res.status(500).send({ message: "require name, token, suggestedBy", data: null });
  }
});

router.put('/decline', function (req, res) {
  /*
  PUT .../api/suggestions/decline?enname=Shirakami Fubuki&suggestedBy=Fish&token= xxx
  Return true
  */
  if (req.query && req.query.suggestedBy && req.query.enname && req.query.token && req.query.token === secrets.token){
    user.findOne(//remove from user
      {name: req.query.suggestedBy},
      (err, target) => {
        if(err || !target){
          res.status(404).send({ message: "name not found", data: null});
          return;
        }
        var newSuggestions = target.suggestions.filter((suggestion)=>{
          return req.query.enname !== suggestion;
        });
        target.suggestions = newSuggestions;
        target.markModified('suggestions');
        target.save((err)=>{
            if(err){
              res.status(404).send({ message: "can't update user", data: null});
            }else{
              pendingVtuber.deleteOne(//remove from pendingVtuber
                {enname: req.query.enname,suggestedBy: req.query.suggestedBy},
                (err)=>{
                  if(err){
                    res.status(404).send({ message: "can't update pendingVtuber", data: null });
                  }else{
                    res.status(200).send({ message: "OK", data: target });
                  }
                }
              )
            }
        })
      }
    )
  }else{
    res.status(500).send({ message: "require name, token, suggestedBy", data: null });
  }
});

router.put('/addTags', function (req, res) {
  /*
  PUT .../api/suggestions/removeTags?enname=Shirakami Fubuki&name=xxx&password=xxx
    body:{tags}
  Return true
  tags = ["a","b",...]
  */
  if (req.query && req.body && req.query.enname && req.body.tags && req.query.name && req.query.password){
    var query = user.find({ name: req.query.name });
    query.exec({},(err,result)=>{
      if (err || result.length === 0){
        res.status(404).send({ message: "name not found", data: null});
      }else{
        if(result[0].password === req.query.password){
          vtuber.findOne(
            {enname: req.query.enname},
            (err, target) => {
              if(err || !target){
                res.status(404).send({ message: "enname not found", data: null});
                return;
              }
              var newTags = req.body.tags.filter((tag)=>{
                return !target.tags.includes(tag);
              });
              target.tags = [...target.tags,...newTags];
              target.markModified('tags');
              target.save((err)=>{
                  if(err){
                    res.status(404).send({ message: "enname not found", data: null});
                  }else{
                    res.status(200).send({ message: "OK", data: target });
                  }
              })
            }
          )
        }else{
          res.status(500).send({ message: "wrong password", data: null });
        }
      }
    })
  }else{
    res.status(500).send({ message: "require enname, tags, username, password", data: null });
  }
});

router.put('/removeTags', function (req, res) {
  /*
  PUT .../api/suggestions/removeTags?enname=Shirakami Fubuki&name=xxx&password=xxx
    body:{tags}
  Return true
  tags = ["a","b",...]
  */
  if (req.query && req.body && req.query.enname && req.body.tags && req.query.name && req.query.password){
    var query = user.find({ name: req.query.name });
    query.exec({},(err,result)=>{
      if (err || result.length === 0){
        res.status(404).send({ message: "name not found", data: null });
      }else{
        if(result[0].password === req.query.password){
          vtuber.findOne(
            {enname: req.query.enname},
            (err, target) => {
              if(err || !target){
                res.status(404).send({ message: "enname not found", data: null});
                return;
              }
              var newTags = target.tags.filter((tag)=>{
                return !req.body.tags.includes(tag);
              });
              target.tags = newTags;
              target.markModified('tags');
              target.save((err)=>{
                  if(err){
                    res.status(404).send({ message: "enname not found", data: null});
                  }else{
                    res.status(200).send({ message: "OK", data: target });
                  }
              })
            }
          )
        }else{
          res.status(500).send({ message: "wrong password", data: null });
        }
      }
    })
  }else{
    res.status(500).send({ message: "require enname, tags, username, password", data: null });
  }
});
module.exports = router;
