var mongoose = require('mongoose');

var adminSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Must Have Username']
  },
  password: {
    type: String,
    required: [true, 'Must Have Password']
  },
  token: {
    type: String,
    required: [true, 'Must Have Token']
  }
},{ collection : 'admin' });

module.exports = mongoose.model('admin', adminSchema);
