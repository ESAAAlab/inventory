var express = require('express');
var router = express.Router();
var pg = require('pg');

var config = {
  "development": {
    "username": "melka",
    "password": null,
    "database": "ESAAA_dev",
    "host": "localhost",
    "dialect": "postgres",
    "define": {
        "timestamps": false
    }
  },
  "test": {
    "username": "postgres",
    "password": "oui$$120",
    "database": "inventaire_test",
    "host": "192.168.0.130",
    "dialect": "postgres"
  },
  "production": {
    "username": "postgres",
    "password": "oui$$120",
    "database": "inventaire_prod",
    "host": "192.168.0.130",
    "dialect": "postgres"
  }
};

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/ESAAA_dev';

var client = new pg.Client(connectionString);
client.connect();

router.get('/', function(req, res, next) {
  res.render('index');
});

// get all todos
router.get('/clients', function(req, res) {
  res.render('partials/clients');
});

// get all todos
router.get('/api/v1/clients', function(req, res) {
  var results = [];
  pg.connect(connectionString, function(err, client, done) {
      // Handle connection errors
      if(err) {
        done();
        console.log(err);
        return res.status(500).json({ success: false, data: err});
      }

      // SQL Query > Select Data
      var query = client.query('SELECT clients.id,clients.barcode,civility.description AS civility,clients.last_name,\
        clients.first_name,class.description AS class, clients.picture \
                                FROM civility\
                                JOIN clients\
                                ON civility.id = clients.civility\
                                JOIN class\
                                ON class.id = clients.class\
                                ORDER BY last_name ASC;');

      // Stream results back one row at a time
      query.on('row', function(row) {
          results.push(row);
      });

      // After all data is returned, close connection and return results
      query.on('end', function() {
          done();
          return res.json(results);
      });
  });
});

// get single client
router.get('/api/v1/client/:id', function(req, res) {
  var results = [];
  var id = req.params.id;
  pg.connect(connectionString, function(err, client, done) {
      // Handle connection errors
      if(err) {
        done();
        console.log(err);
        return res.status(500).json({ success: false, data: err});
      }

      // SQL Query > Select Data
      var query = client.query("SELECT * FROM clients WHERE id=($1);",[id]);

      // Stream results back one row at a time
      query.on('row', function(row) {
          results.push(row);
      });

      // After all data is returned, close connection and return results
      query.on('end', function() {
          done();
          return res.json(results);
      });
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
