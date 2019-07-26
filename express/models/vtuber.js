var mongoose = require('mongoose');

var vtuberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Must Have Username']
  },
  enname: {
    type: String,
    unique: true,
    required: [true, 'Must Have Password']
  },
  youtubeId: {
    type: String,
    required: [true, 'Must Have youtubeid']
  },
  twitterId: {
    type: String,
    required: [true, 'Must Have twitterid']
  },
  biliId: {
    type: String,
    required: [true, 'Must Have biliid'],
    default: "0",
  },
  tags: {
    type: [String],
  },
  thumbnailSource:{
    type: String,
    default: 'youtube',
    enum: ['youtube','twitter','bilibili'],
  },
  followerCount:{
    type: Number,
    default: 0,
  },//unused
  follower:{
    type: [String],
  },//unused
},{ collection : 'vtubers' });

module.exports = mongoose.model('vtuber', vtuberSchema);
