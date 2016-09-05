var models = require('../models/index');
var express = require('express');
var router = express.Router();
var md5 = require('md5');

// FRONTEND ROUTES
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/users', function(req, res) {
  res.render('partials/users');
});

router.get('/inventory', function(req, res) {
  res.render('partials/inventory');
});

// API ROUTES
// INVENTORY ITEMS
// GET COMPLETE USER LIST
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
// SEARCH USER BY NAME
router.get('/api/v1/user/search/:str', function(req, res) {
  models.user.findAll({
    where: {lastName:{$ilike:req.params.str+'%'}},
    order: [['updatedAt', 'DESC']],
    include: [
      {model:models.userType, where: {description:'Étudiant'}},
      {model:models.studentYear},
      {model:models.document, as:'pictures', where: {type:'userProfilePic'}, required: false}
    ]
  }).then(function(sqlResult) {
    res.json(sqlResult);
  });
});
// GET SINGLE USER
router.get('/api/v1/user/:id', function(req, res) {
  models.user.findOne({
    where: {id:req.params.id},
    include: [
      {model:models.userType, where: {description:'Étudiant'}},
      {model:models.studentYear},
      {model:models.document, as:'pictures', where: {type:'userProfilePic'}, required: false}
    ],
    order: [['lastName', 'ASC']]
  }).then(function(sqlResult) {
    res.json(sqlResult);
  });
});
// CREATE NEW ITEM
router.post('/api/v1/user', function(req, res) {
  models.user.create({
    barcode: md5(req.body.firstName+req.body.lastName),
    title: req.body.title,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    isRegistered: req.body.isRegistered,
    email: req.body.email,
    cellPhone: req.body.cellPhone,
    homePhone: req.body.homePhone,
    addressStreet: req.body.addressStreet,
    addressCity: req.body.addressCity,
    addressState: req.body.addressState,
    addressPostcode: req.body.addressPostcode,
    loginUsername: req.body.loginUsername,
    loginPassword: req.body.loginPassword,   // FOR DEVELOPMENT ONLY, MUST BE REMOVED IN PRODUCTION
    loginSalt: req.body.loginSalt,
    loginMD5: req.body.loginMD5,
    loginSHA1: req.body.loginSHA1,
    loginSHA256: req.body.loginSHA256,
    userTypeId: req.body.userTypeId,
    studentYearId: req.body.studentYearId
  }).then(function(sqlResult) {
    res.send(sqlResult);
  });
});
// UPDATE EXISTING ITEM
router.put('/api/v1/user/:id', function(req, res) {
  models.user.find({
    where: {
      id: req.params.id
    }
  }).then(function(item) {
    if(item){
      item.updateAttributes({
        barcode: md5(req.body.firstName+req.body.lastName),
        title: req.body.title,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        isRegistered: req.body.isRegistered,
        email: req.body.email,
        cellPhone: req.body.cell,
        homePhone: req.body.phone,
        addressStreet: req.body.street,
        addressCity: req.body.city,
        addressState: req.body.state,
        addressPostcode: req.body.postcode,
        loginUsername: req.body.username,
        loginPassword: req.body.password,   // FOR DEVELOPMENT ONLY, MUST BE REMOVED IN PRODUCTION
        loginSalt: req.body.salt,
        loginMD5: req.body.md5,
        loginSHA1: req.body.sha1,
        loginSHA256: req.body.sha256,
        userTypeId: req.body.userTypeId,
        studentYearId: req.body.studentYearId
      }).then(function(sqlResult) {
        res.send(sqlResult);
      });
    }
  });
});
// DELETE USER
router.delete('/api/v1/user/:id', function(req, res) {
  models.user.destroy({where: {
    id: req.params.id
  }}).then(function(sqlResult) {
    res.sendStatus(sqlResult == 1 ? 200 : 400);
  });
});
// -------------
router.get('/api/v1/studentYears', function(req, res) {
  models.studentYear.findAll({
    order:[['description','ASC']]
  }).then(function(sqlResult) {
    res.json(sqlResult);
  });
});
router.get('/api/v1/userTypes', function(req, res) {
  models.userType.findAll({
    order:[['description','ASC']]
  }).then(function(sqlResult) {
    res.json(sqlResult);
  });
});

// INVENTORY ITEMS
// GET COMPLETE INVENTORY
router.get('/api/v1/inventory', function(req, res) {
  models.item.findAll({
    order: [['updatedAt', 'DESC']]
  }).then(function(sqlResult) {
    res.json(sqlResult);
  });
});
// SEARCH ITEM BY NAME
router.get('/api/v1/inventory/search/:str', function(req, res) {
  models.item.findAll({
    where: {name:{$ilike:req.params.str+'%'}},
    order: [['updatedAt', 'DESC']]
  }).then(function(sqlResult) {
    res.json(sqlResult);
  });
});
// GET SINGLE ITEM
router.get('/api/v1/inventory/:id', function(req, res) {
  models.item.findOne({
    where: {id:req.params.id}
  }).then(function(sqlResult) {
    res.json(sqlResult);
  });
});
// CREATE NEW ITEM
router.post('/api/v1/inventory', function(req, res) {
  console.log(req.body);
  models.item.create({
    name: req.body.name,
    model: req.body.model,
    brand: req.body.brand,
    serialNumber: req.body.serialNumber,
    inventoryNumber: req.body.inventoryNumber,
    acquisitionPrice: req.body.acquisitionPrice,
    acquisitionDate: req.body.acquisitionDate,
    description: req.body.description,
    isConsummable: req.body.isConsummable,
    stockMax: req.body.stockMax,
    stockAvailable: req.body.stockAvailable,
    stockUnit: req.body.stockUnit,
    stockStep:  req.body.stockStep,
    itemLocationId: req.body.itemLocationId,
    itemCategoryId: req.body.itemCategoryId
  }).then(function(sqlResult) {
    res.send(sqlResult);
  });
});
// UPDATE EXISTING ITEM
router.put('/api/v1/inventory/:id', function(req, res) {
  models.item.find({
    where: {
      id: req.params.id
    }
  }).then(function(item) {
    if(item){
      item.updateAttributes({
        name: req.body.name,
        model: req.body.model,
        brand: req.body.brand,
        serialNumber: req.body.serialNumber,
        inventoryNumber: req.body.inventoryNumber,
        acquisitionPrice: req.body.acquisitionPrice,
        acquisitionDate: req.body.acquisitionDate,
        description: req.body.description,
        isConsummable: req.body.isConsummable,
        stockMax: req.body.stockMax,
        stockAvailable: req.body.stockAvailable,
        stockUnit: req.body.stockUnit,
        stockStep:  req.body.stockStep,
        itemLocationId: req.body.itemLocationId,
        itemCategoryId: req.body.itemCategoryId
      }).then(function(sqlResult) {
        res.send(sqlResult);
      });
    }
  });
});
// DELETE ITEM
router.delete('/api/v1/inventory/:id', function(req, res) {
  models.item.destroy({where: {
    id: req.params.id
  }}).then(function(sqlResult) {
    res.sendStatus(sqlResult == 1 ? 200 : 400);
  });
});
// -------------
router.get('/api/v1/itemCategories', function(req, res) {
  models.itemCategory.findAll({order: [['parentId', 'ASC'],['id', 'ASC']]}).then(function(sqlResult) {
    res.json(sqlResult);
  });
});
router.get('/api/v1/itemLocations', function(req, res) {
  models.itemLocation.findAll({order: [['description', 'ASC']]}).then(function(sqlResult) {
    res.json(sqlResult);
  });
});

module.exports = router;
