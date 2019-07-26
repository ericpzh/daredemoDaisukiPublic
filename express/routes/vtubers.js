var express = require('express'),
  router = express.Router(),
  secrets = require('../config/secrets'),
  vtuber = require('../models/vtuber');
var mongoose = require('mongoose');

router.get('/', function (req, res) {
  /*
  GET .../api/vtubers?enname=Shirakami Fubuki
  Return [{name,enname,youtubeId,twitterId,biliId}]
  GET .../api/vtubers?ennames=Shirakami Fubuki,Minato Aqua
  Return [{name,enname,youtubeId,twitterId,biliId},...]
  */
  if (req.query && req.query.enname){//get one
    var query = vtuber.find(req.query);
    query.exec({},(err,result)=>{
      if (err){
        res.status(404).send({ message: "enname not found", data: [] });
      }else{
        res.status(200).send({ message: "OK", data: result.map((item)=>{return {
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
  }else if(req.query && req.query.ennames){//get many
    var ennames = req.query.ennames.split(',');
    var query = vtuber.find({
      enname: {$in: ennames}
    });
    query.exec({},(err,result)=>{
      if (err){
        res.status(404).send({ message: "enname not found", data: [] });
      }else{
        res.status(200).send({ message: "OK", data: result.map((item)=>{return {
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
    res.status(500).send({ message: "enname: xxx or ennames:xxx,xxx", data: [] });
  }
});

router.get('/all', function (req, res) {
  /*
  GET .../api/vtubers/all(?page=0&subscriptions=Shirakami Fubuki,Minato Aqua)
  Return [{name,enname,youtubeId,twitterId,biliId},...]
  */
  const perpage = 10;
  var page = req.query.page?req.query.page:0;
  var subscriptions = req.query.subscriptions?req.query.subscriptions.split(','):[];
  var query = vtuber.find({ "enname": { "$nin": subscriptions } }).sort('enname').skip(page*perpage).limit(perpage);
  query.exec({},(err,result)=>{
    if (err){
      res.status(404).send({ message: "error", data: [] });
    }else{
      res.status(200).send({ message: "OK", data: result.map((item)=>{return {
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
  GET .../api/vtubers/query?query=fubuki
  Return [{name,enname,youtubeId,twitterId,biliId},...]
  */
  if (req.query && req.query.query){
    var query = vtuber.find({ $or:
      [{ "name": { "$regex": req.query.query, "$options": "i" } },
       { "enname": { "$regex": req.query.query, "$options": "i" } },
       { "tags": {"$regex": req.query.query, "$options": "i"} }]
    });
    query.exec({},(err,result)=>{
      if (err){
        res.status(404).send({ message: "not found", data: [] });
      }else{
        var regex = new RegExp(req.query.query,'i');
        result = result.sort((a,b)=>{//giving priority of query in name/enname -> query in tags
          var inNameA = regex.test(a.name+a.enname);
          var inNameB = regex.test(b.name+b.enname);
          if(inNameA && inNameB){
            return b.tags.length - a.tags.length;
          }else if(inNameA){
            return -1;
          }else if(inNameB){
            return 1;
          }else{
            return b.tags.length - a.tags.length;
          }
        });
        if(result.length > 100){//max 100 results
          result = result.slice(0,100);
        }
        res.status(200).send({ message: "OK", data: result.map((item)=>{return {
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
  POST .../api/vtubers
    body:{name,enname,youtubeId,twitterId,biliId,token,tags,thumbnailSource}
  Return [{name,enname,youtubeId,twitterId,biliId}]
  */
  var name = req.body.name;
  var enname = req.body.enname;
  var youtubeId = req.body.youtubeId;
  var twitterId = req.body.twitterId;
  var biliId = req.body.biliId;
  var token = req.body.token;
  var tags = req.body.tags?req.body.tags:[];
  var thumbnailSource = req.body.thumbnailSource;
  if (name && enname && youtubeId && twitterId && biliId && tags && thumbnailSource && token && token === secrets.token) {
    var msg = new vtuber({
      name: name,
      enname: enname,
      youtubeId: youtubeId,
      twitterId: twitterId,
      biliId: biliId,
      tags: tags,
      thumbnailSource: thumbnailSource,
    })
    msg.save({},(err,doc) => {
      if (err){
        res.status(500).send({ message: "enname exist", data: [] });
      }else{
        res.status(201).send({ message: "OK", data: doc });
      }
    });
  }else{
    res.status(500).send({ message: "require name, enname, youtubeId, twitterId, biliId, token", data: [] });
  }
});

router.put('/', function (req, res) {
  /*
  PUT .../api/vtubers?enname=Shirakami Fubuki&token= xxx
    body:{name,youtubeId,twitterId,biliId,tags,thumbnailSource}
  Return true
  */
  if (req.query && req.body && req.query.enname && req.body.name && req.body.youtubeId && req.body.twitterId && req.body.biliId && req.body.tags && req.body.thumbnailSource && req.query.token && req.query.token === secrets.token){
    vtuber.findOneAndUpdate(
      {enname: req.query.enname},
      {
        name: req.body.name,
        youtubeId: req.body.youtubeId,
        twitterId: req.body.twitterId,
        biliId: req.body.biliId,
        tags: req.body.tags,
        thumbnailSource: req.body.thumbnailSource,
      },
      (err)=>{
        if(err){
          res.status(404).send({ message: "enname not found", data: false });
        }else{
          res.status(200).send({ message: "OK", data: true });
        }
      }
    );
  }else{
    res.status(500).send({ message: "require name, youtubeId, twitterId, biliId, token", data: false });
  }
});

router.put('/addTags', function (req, res) {
  /*
  PUT .../api/vtubers/addTags?enname=Shirakami Fubuki&token= xxx
    body:{tags}
  Return true
  tags = ["a","b",...]
  */
  if (req.query && req.body && req.query.enname && req.body.tags && req.query.token && req.query.token === secrets.token){
    vtuber.findOne(
      {enname: req.query.enname},
      (err, target) => {
        if(err || !target){
          res.status(404).send({ message: "enname not found", data: false});
          return;
        }
        var newTags = req.body.tags.filter((tag)=>{
          return !target.tags.includes(tag);
        });
        target.tags = [...target.tags,...newTags];
        target.markModified('tags');
        target.save((err)=>{
            if(err){
              res.status(404).send({ message: "enname not found", data: false});
            }else{
              res.status(200).send({ message: "OK", data: true });
            }
        })
      }
    )
  }else{
    res.status(500).send({ message: "require name, tags, token", data: false });
  }
});

router.put('/removeTags', function (req, res) {
  /*
  PUT .../api/vtubers/removeTags?enname=Shirakami Fubuki&token= xxx
    body:{tags}
  Return true
  tags = ["a","b",...]
  */
  if (req.query && req.body && req.query.enname && req.body.tags && req.query.token && req.query.token === secrets.token){
    vtuber.findOne(
      {enname: req.query.enname},
      (err, target) => {
        if(err || !target){
          res.status(404).send({ message: "enname not found", data: false});
          return;
        }
        var newTags = target.tags.filter((tag)=>{
          return !req.body.tags.includes(tag);
        });
        target.tags = newTags;
        target.markModified('tags');
        target.save((err)=>{
            if(err){
              res.status(404).send({ message: "enname not found", data: false});
            }else{
              res.status(200).send({ message: "OK", data: true });
            }
        })
      }
    )
  }else{
    res.status(500).send({ message: "require name, tags, token", data: false });
  }
});

router.delete('/', function (req, res) {
  /*
  DELETE .../api/vtubers?enname=Shirakami Fubuki&token=xxx
  Return true
  */
  if (req.query && req.query.enname && req.query.token && req.query.token === secrets.token){
    vtuber.deleteOne(
      {enname: req.query.enname},
      (err)=>{
        if(err){
          res.status(404).send({ message: "enname not found", data: false });
        }else{
          res.status(200).send({ message: "OK", data: true });
        }
      }
    );
  }else{
    res.status(500).send({ message: "name: xxx, token:xxx ", data: false });
  }
});

router.delete('/all', function (req, res) {
  /*
  DELETE .../api/vtubers/all?&token=xxx
  Return true
  */
  if (req.query.token && req.query.token === secrets.token){
    vtuber.deleteMany({},(err)=>{
      res.status(200).send({ message: "OK", data: true });
    });
  }else{
    res.status(500).send({ message: "name: xxx, token:xxx ", data: false });
  }
});

module.exports = router;
