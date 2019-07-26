var mongoose = require('mongoose');

var pendingVtuberSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: [true, 'Must Have date']
  },
  suggestedBy: {
    type: String,
    required: [true, 'Must Have suggestedBy']
  },
  name: {
    type: String,
    required: [true, 'Must Have Username']
  },
  enname: {
    type: String,
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
    required: [true, 'Must Have biliid']
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
},{ collection : 'pendingVtubers' });

pendingVtuberSchema.index({ "suggestedBy": 1, "enname": 1}, { "unique": true });

module.exports = mongoose.model('pendingVtuber', pendingVtuberSchema);
