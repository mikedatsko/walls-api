var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var tokens = require('../tokens');

var User = require('../models/user');
var Device = require('../models/device');

// router.post('/', addUser);

router.get('/', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);

  if (decoded === null) {
    return res.status(401).json({
      title: 'Not authenticated',
      error: {
        message: 'Could not found user\'s authentication record'
      }
    });
  }

  User.findById(decoded.user._id, function(err, user) {
    if (err) {
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }

    res.status(200).json({
      message: user,
      obj: {}
    });
  });
});

router.patch('/', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  // console.log('decoded:', decoded, req.body.points);
  if (decoded === null) {
    return res.status(401).json({
      title: 'Not authenticated',
      error: {
        message: 'Could not found user\'s authentication record'
      }
    });
  }

  User.findById(decoded.user._id, function(err, user) {
    if (err) {
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }

    if (!user) {
      return res.status(500).json({
        title: 'No user found',
        error: {
          message: 'User not found'
        }
      });
    }

    user.firstName = req.body.firstName;
    user.save(function(err, result) {
      if (err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }

      res.status(200).json({
        message: 'Updated user',
        obj: result
      });
    });
  });
});

router.patch('/points', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  // console.log('decoded:', decoded, req.body.points);
  if (decoded === null) {
    return res.status(401).json({
      title: 'Not authenticated',
      error: {
        message: 'Could not found user\'s authentication record'
      }
    });
  }

  User.findById(decoded.user._id, function(err, user) {
    if (err) {
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }

    if (!user) {
      return res.status(500).json({
        title: 'No user found',
        error: {
          message: 'User not found'
        }
      });
    }

    user.points = req.body.points;
    user.save(function(err, result) {
      if (err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }

      res.status(200).json({
        message: 'Updated user',
        obj: result
      });
    });
  });
});

router.post('/signin', signIn);

router.get('/list', function (req, res, next) {
  User.find()
    // .where('name.last').equals('Ghost')
    // .where('age').gt(17).lt(66)
    // .where('likes').in(['vaporizing', 'talking'])
    .limit(10)
    // .sort('-occupation')
    // .select('name occupation')
    .exec(function(err, users) {
      if (err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }

      res.status(200).json({
        message: users,
        // token: token,
        // userId: user._id
      });
    });
});

router.get('/leaders', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);

  if (decoded === null) {
    return res.status(401).json({
      title: 'Not authenticated',
      error: {
        message: 'Could not found user\'s authentication record'
      }
    });
  }

  User.findById(decoded.user._id, function(err, user) {
    if (err) {
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }

    User.find()
    // .where('name.last').equals('Ghost')
    // .where('age').gt(17).lt(66)
    // .where('likes').in(['vaporizing', 'talking'])
    .sort('-points')
    .sort('created')
    .limit(10)
    // .select('name occupation')
    .exec(function(err, users) {
      if (err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }

      res.status(200).json({
        message: {
          users: users,
          userId: user._id
        }
      });
    });
  });
});

router.get('/place', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);

  if (decoded === null) {
    return res.status(401).json({
      title: 'Not authenticated',
      error: {
        message: 'Could not found user\'s authentication record'
      }
    });
  }

  User.findById(decoded.user._id, function(err, user) {
    if (err) {
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }

    if (!user) {
      return res.status(500).json({
        title: 'No user found',
        error: {
          message: 'User not found'
        }
      });
    }

    if (!user.points) {
      User.find()
      .sort('points')
      .sort('created')
      .count()
      .exec(function(err, place) {
        if (err) {
          return res.status(500).json({
            title: 'An error occured',
            error: err
          });
        }

        if (typeof place === 'undefined' || place === null) {
          return res.status(404).json({
            title: 'No place found',
            error: {
              message: 'Place not found'
            }
          });
        }

        res.status(200).json({
          message: place
        });
      });
    } else {
      User.find({
        points: {
          $gt: user.points
        }
      })
      .count()
      .exec(function(err, place) {
        if (err) {
          return res.status(500).json({
            title: 'An error occured',
            error: err
          });
        }

        if (typeof place === 'undefined' || place === null) {
          return res.status(404).json({
            title: 'No place found',
            error: {
              message: 'Place not found'
            }
          });
        }

        res.status(200).json({
          message: (place + 1)
        });
      });
    }
  });
});

router.get('/device', getDevice);
router.get('/name', getName);

function getDevice(req, res, next) {
  var deviceId = req.query.deviceId;

  Device.find({'deviceId': deviceId})
    .exec(function(err, device) {
      if (err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }

      // console.log('getDevice', device, deviceId);

      if (!device || !device.length) {
        return addUser(deviceId, function(status, user) {
          // console.log('getDevice', 'addUser', status, user);
          return addDevice(deviceId, user, function(status, device) {
            // console.log('getDevice', 'addDevice', status, device);
            return signInUser(user._id, function(status, token) {
              res.status(status).json({
                message: {
                  userName: token.user.firstName,
                  token: token.token
                }
              });
            });
          });
        });
      }

      signInUser(device[0].user, function(status, token) {
        res.status(status).json({
          message: {
            userName: token.user.firstName,
            token: token.token
          }
        });
      });
    });
}

function getName(req, res, next) {
  var userName = req.query.userName;

  User.find({'firstName': userName})
    .exec(function(err, user) {
      if (err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }

      res.status(200).json({
        message: {
          isUserExist: user && user.length
        }
      });
    });
}

function addUser(deviceId, callback) {
  User.find({'email': deviceId + '@datsko.it'})
    .exec(function(err, user) {
      if (err) {
        return callback(500, {
          title: 'An error occured',
          error: err
        });
      }

      if (!user || !user.length) {
        var user = new User({
          firstName: deviceId,
          lastName: '',
          email: deviceId + '@datsko.it',
          password: bcrypt.hashSync('123456', 10),
          created: Date.now(),
          points: 0
        });

        return user.save(function(err, result) {
          if (err) {
            return callback(500, {
              title: 'An error occured',
              error: err
            });
          }

          return callback(201, result);
        });
      }

      return callback(200, user[0]);
    });
}

function addDevice(deviceId, user, callback) {
  // console.log('addDevice', deviceId, user._id);

  var device = new Device({
    deviceId: deviceId,
    user: user,
    created: new Date()
  });

  device.save(function(err, result) {
    if (err) {
      return callback(500, {
        title: 'An error occured',
        error: err
      });
    }

    return callback(201, {
      message: 'Device created',
      device: result
    });
  });
}

function signIn(req, res, next) {

  User.find({email: req.body.email}, function(err, user) {
    if (err) {
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }

    if (!user || !user.length) {
      return res.status(404).json({
        title: 'No user found',
        error: {
          message: 'User could not be found'
        }
      });
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({
        title: 'Wrong password',
        error: {
          message: 'Invalid user password'
        }
      });
    }

    var token = jwt.sign({user: user}, tokens.authSecret, {expiresIn: 3000000});

    res.status(201).json({
      message: 'User login success',
      token: token,
      userId: user._id
    });
  });
}

function signInUser(userId, callback) {
  // console.log('signInUser', userId);

  User.findById(userId, function(err, user) {
    if (err) {
      return callback(500, {
        title: 'An error occured',
        error: err
      });
    }

    if (!user) {
      return callback(404, {
        title: 'No user found',
        error: {
          message: 'User could not be found'
        }
      });
    }

    // if (!bcrypt.compareSync(req.body.password, user.password)) {
    //   return res.status(401).json({
    //     title: 'Wrong password',
    //     error: {
    //       message: 'Invalid user password'
    //     }
    //   });
    // }

    var token = jwt.sign({user: user}, tokens.authSecret, {expiresIn: 3000000});

    callback(201, {
      message: 'User login success',
      token: token,
      user: user
    });
  });
}

module.exports = router;
