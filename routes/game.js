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
  Task.find()
    .exec(function(err, tasks) {
      if (err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }

      res.status(200).json({
        message: 'Success',
        obj: tasks
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

    var task = new Task({
      name: req.body.name,
      user: user
    });
    task.save(function(err, result) {
      if (err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }

      user.tasks.push(result);
      user.save();

      res.status(201).json({
        message: 'Saved task',
        obj: result
      });
    });
  });
});

router.patch('/:id', function(req, res, next) {
  Task.findById(req.params.id, function(err, task) {
    if (err) {
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }

    if (!task) {
      return res.status(500).json({
        title: 'No task found',
        error: {
          message: 'Task not found'
        }
      });
    }

    task.name = req.body.name;
    task.save(function(err, result) {
      if (err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }

      res.status(200).json({
        message: 'Updated task',
        obj: result
      });
    });
  });
});

router.delete('/:id', function(req, res, next) {
  Task.findById(req.params.id, function(err, task) {
    if (err) {
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }

    if (!task) {
      return res.status(500).json({
        title: 'No task found',
        error: {
          message: 'Task not found'
        }
      });
    }

    task.name = req.body.name;
    task.remove(function(err, result) {
      if (err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }

      res.status(200).json({
        message: 'Removed task',
        obj: result
      });
    });
  });
});

module.exports = router;