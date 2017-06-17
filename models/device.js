var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./user');

var schema = new Schema({
  deviceId: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  created: {
    type : Date,
    default: Date.now
  }
});

schema.post('remove', function(device) {
  User.findById(device.user, function(err, user) {
    user.devices.pull(device);
    user.save();
  });
});

module.exports = mongoose.model('Device', schema);