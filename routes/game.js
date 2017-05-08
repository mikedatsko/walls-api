var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var tokens = require('../tokens');

var User = require('../models/user');
var Game = require('../models/game');

router.use('/', function(req, res, next) {
  jwt.verify(req.query.token, tokens.authSecret, function(err, decoded) {
    if (err) {
      return res.status(401).json({
        title: 'Not authenticated',
        error: err
      });
    }

    next();
  });
});

router.get('/', function(req, res, next) {
  Game.find()
    .exec(function(err, games) {
      if (err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }

      res.status(200).json({
        message: 'Success',
        obj: games
      });
    });
});

router.post('/', function(req, res, next) {
  var decoded = jwt.decode(req.query.token);
  User.findById(decoded.user._id, function(err, user) {
    if (err) {
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }

    var game = new Game({
      points: req.body.points,
      user: user,
      created: Date.now()
    });
    game.save(function(err, result) {
      if (err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }

      user.games.push(result);
      user.save();

      res.status(201).json({
        message: 'Saved game',
        obj: result
      });
    });
  });
});

router.patch('/:id', function(req, res, next) {
  Game.findById(req.params.id, function(err, game) {
    if (err) {
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }

    if (!game) {
      return res.status(500).json({
        title: 'No game found',
        error: {
          message: 'Game not found'
        }
      });
    }

    game.name = req.body.name;
    game.save(function(err, result) {
      if (err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }

      res.status(200).json({
        message: 'Updated game',
        obj: result
      });
    });
  });
});

router.delete('/:id', function(req, res, next) {
  Game.findById(req.params.id, function(err, game) {
    if (err) {
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }

    if (!game) {
      return res.status(500).json({
        title: 'No game found',
        error: {
          message: 'Game not found'
        }
      });
    }

    game.name = req.body.name;
    game.remove(function(err, result) {
      if (err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }

      res.status(200).json({
        message: 'Removed game',
        obj: result
      });
    });
  });
});

module.exports = router;