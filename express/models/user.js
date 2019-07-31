var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Must Have Username']
  },
  password: {
    type: String,
    required: [true, 'Must Have Password']
  },
  twitterapikey: {
    type: {
      key: String,
      secretKey: String,
      token: String,
      secretToken: String,
    },
  },
  googleapikey: {
    type: String,
  },
  subscriptions: {
    type: [String],
  },
  groups: {
    type: [
      {
        name: String,
        vtubers: [String]
      }
    ]
  },
  suggestions: {
    type: [String],
  },
  nickname: {
    type: String,
  },
  image: {
    type: String,
  },
},{ collection : 'users' });

module.exports = mongoose.model('user', userSchema);
