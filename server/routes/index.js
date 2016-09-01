var express = require('express');
var router = express.Router();
var models = require('../models/index');

router.get('/', function(req, res, next) {
  res.render('index');
});

// get all todos
router.get('/todos', function(req, res) {
  res.render('partials/todos');
});

// get all todos
router.get('/api/v1/todos', function(req, res) {
  models.Todo.findAll({}).then(function(todos) {
    res.json(todos);
  });
});

router.get('/api/v1/users', function(req, res) {
  models.User.findAll({}).then(function(user) {
    res.json(user);
  });
});

// get single todo
router.get('/api/v1/todo/:id', function(req, res) {
  models.Todo.find({
    where: {
      id: req.params.id
    }
  }).then(function(todo) {
    res.json(todo);
  });
});

/*router.post('/users', function(req, res) {
  models.User.create({
    email: req.body.email
  }).then(function(user) {
    res.json(user);
  });
});

// add new todo
router.post('/todos', function(req, res) {
  models.Todo.create({
    title: req.body.title,
    UserId: req.body.user_id
  }).then(function(todo) {
    res.json(todo);
  });
});

// update single todo
router.put('/todo/:id', function(req, res) {
  models.Todo.find({
    where: {
      id: req.params.id
    }
  }).then(function(todo) {
    if(todo){
      todo.updateAttributes({
        title: req.body.title,
        complete: req.body.complete
      }).then(function(todo) {
        res.send(todo);
      });
    }
  });
});

// delete a single todo
router.delete('/todo/:id', function(req, res) {
  models.Todo.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(todo) {
    res.json(todo);
  });
});*/

module.exports = router;
