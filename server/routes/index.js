var models = require('../models/index');
var express = require('express');
var router = express.Router();


// FRONTEND ROUTES
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/users', function(req, res) {
  res.render('partials/clients');
});

// API ROUTES

router.get('/api/v1/users', function(req, res) {
  models.user.findAll({
    include: [
      {model:models.userType, where: {description:'Étudiant'}},
      {model:models.studentYear},
      {model:models.document, as:'pictures', where: {type:'userProfilePic'}}
    ],
    order: [['lastName', 'ASC']]
  }).then(function(sqlResult) {
    res.json(sqlResult);
  });
});

router.get('/api/v1/civilities', function(req, res) {
  models.civility.findAll({}).then(function(sqlResult) {
    res.json(sqlResult);
  });
});

router.post('/api/v1/civility', function(req, res) {
  models.civility.create({
    description: req.body.description
  }).then(function(sqlResult) {
    res.json(sqlResult);
  });
});

router.get('/api/v1/studentYears', function(req, res) {
  models.studentYear.findAll({}).then(function(sqlResult) {
    res.json(sqlResult);
  });
});

router.post('/api/v1/studentYear', function(req, res) {
  models.studentYear.create({
    year: req.body.year,
    section: req.body.section,
    description: req.body.description
  }).then(function(sqlResult) {
    res.json(sqlResult);
  });
});

router.get('/api/v1/userTypes', function(req, res) {
  models.userType.findAll({}).then(function(sqlResult) {
    res.json(sqlResult);
  });
});

router.post('/api/v1/userType', function(req, res) {
  models.userType.create({
    description: req.body.description
  }).then(function(sqlResult) {
    res.json(sqlResult);
  });
});

module.exports = router;


