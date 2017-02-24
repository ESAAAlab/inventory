var models = require('../models/index');
var express = require('express');
var router = express.Router();
var md5 = require('md5');
var jsonQuery = require('json-query');

// FRONTEND ROUTES
router.get("/", function (req, res) {
  res.render('index');
});

// API ROUTES
// LENDING
// CREATE NEW USER TRANSACTION
router.post('/api/v1/transaction', function(req, res) {
  var defaultEndDate = new Date();
  defaultEndDate.setDate(defaultEndDate.getDate()+3);
  models.item.findOne({
    where: {id:req.body.itemId},
  }).then(function(sqlItem) {
    models.user.findOne({
      where: {id:req.body.userId},
    }).then(function(sqlUser) {
      models.transaction.create({
        type:'lending',
        startDate: new Date(),
        endDate: defaultEndDate,
        ended: false,
        quantity: 1
      }).then(function(sqlTransaction) {
        sqlItem.addLending(sqlTransaction);
        sqlUser.addLending(sqlTransaction);
        sqlItem.updateAttributes({
          stockAvailable:sqlItem.stockAvailable-1
        }).then(function(sqlResult) {
          res.json(sqlTransaction);
        });
      });
    });
  });
});

router.put('/api/v1/transaction/:id', function(req, res) {
  models.transaction.findOne({
    where: {id: req.params.id},
    include:[
      {model:models.item, as:'transactions', required: false}
    ]
  }).then(function(transaction) {
    var item = transaction.transactions[0];
    item.updateAttributes({
      stockAvailable:item.stockAvailable+1
    }).then(function(sqlResult) {
      transaction.updateAttributes({
        ended:true
      }).then(function(sqlResult) {
        res.send(sqlResult);
      });
    });
  });
});

router.get('/api/v1/transaction/user/:id', function(req, res) {
  models.transaction.findAll({
    where:{ended:false},
    include:[
      {model:models.user, as:'lendings', where: {id:req.params.id}, required: true},
      {model:models.item, as:'transactions'}
    ],
    order: [['createdAt', 'DESC']]
  }).then(function(sqlResult) {
    res.json(sqlResult);
  });
});

router.get('/api/v1/transaction/item/:id', function(req, res) {
  models.transaction.findAll({
    include:[
      {model:models.item, as:'transactions', where: {id:req.params.id}, required: true},
      {model:models.user, as:'lendings'}
    ]
  }).then(function(sqlResult) {
    res.json(sqlResult);
  });
});

// USERS
// GET COMPLETE USER LIST
router.get('/api/v1/users', function(req, res) {
  models.user.findAll({
    include: [
      {model:models.userType, where: {description:'Étudiant'}},
      {model:models.studentYear},
      {model:models.document, as:'pictures', where: {type:'userProfilePic'}},
      {model:models.transaction, as:'lendings', where: {type:'lending'}, required: false}
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
      {model:models.document, as:'pictures', where: {type:'userProfilePic'}, required: false},
      {model:models.transaction, as:'lendings', where: {type:'lending'}, required: false},
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
      {model:models.document, as:'pictures', where: {type:'userProfilePic'}, required: false},
      {model:models.transaction, as:'lendings', where: {type:'lending', ended:false}, required: false},
    ],
    order: [['lastName', 'ASC']]
  }).then(function(sqlResult) {
    res.json(sqlResult);
  });
});
// CREATE NEW USER
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
// UPDATE EXISTING USER
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
        cellPhone: req.body.cellPhone,
        homePhone: req.body.homePhone,
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
  console.log("SEARCHING API");
  models.item.findAll({
    where: {name:{$ilike:req.params.str+'%'}},
    include:[
      {model:models.transaction, as:'stockCounts'},
      {model:models.transaction, as:'lendings'}
    ],
    order: [['updatedAt', 'DESC']]
  }).then(function(sqlResult) {
    res.json(sqlResult);
  });
});
// GET SINGLE ITEM
router.get('/api/v1/inventory/:id', function(req, res) {
  models.item.findOne({
    where: {id:req.params.id},
    include:[
      {model:models.transaction, as:'stockCounts'},
      {model:models.transaction, as:'lendings'}
    ],
  }).then(function(sqlResult) {
    res.json(sqlResult);
  });
});
// CREATE NEW ITEM
router.post('/api/v1/inventory', function(req, res) {
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
