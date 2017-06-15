var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var tokens = require('../tokens');

var User = require('../models/user');

router.post('/', function (req, res, next) {
  var user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    created: req.body.created,
    points: req.body.points
  });

  user.save(function(err, result) {
    if (err) {
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }

    res.status(201).json({
      message: 'User created',
      obj: result
    });
  });
});

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

router.post('/signin', function (req, res, next) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) {
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }

    if (!user) {
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
});

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
  User.find()
    // .where('name.last').equals('Ghost')
    // .where('age').gt(17).lt(66)
    // .where('likes').in(['vaporizing', 'talking'])
    .sort('-points')
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
        message: users,
        // token: token,
        // userId: user._id
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

    User.find({'points': { '$gt' : user.points}})
      .count()
      .exec(function(err, place) {
        if (err) {
          return res.status(500).json({
            title: 'An error occured',
            error: err
          });
        }

        if (typeof place === 'undefined' || place === null) {
          return res.status(500).json({
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
  });
});

module.exports = router;
