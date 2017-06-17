var mongoose = require('mongoose');
var mongooseUniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var schema = new Schema({
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  games: [{
    type: Schema.Types.ObjectId,
    ref: 'Game'
  }],
  device: [{
    type: Schema.Types.ObjectId,
    ref: 'Device'
  }],
  created: {
    type: Date,
    default: Date.now()
  },
  points: {
    type: Number,
    required: true,
    default: 0
  }
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', schema);