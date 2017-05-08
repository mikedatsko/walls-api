var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./user');

var schema = new Schema({
  points: {
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

schema.post('remove', function(game) {
  User.findById(game.user, function(err, user) {
    user.games.pull(game);
    user.save();
  });
});

module.exports = mongoose.model('Game', schema);