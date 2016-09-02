'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('user', {
    barcode: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    isRegistered: DataTypes.BOOLEAN,
    email: DataTypes.STRING,
    cellPhone: DataTypes.STRING,
    homePhone: DataTypes.STRING,
    workPhone: DataTypes.STRING,
    addressStreetNum: DataTypes.STRING,
    addressField1: DataTypes.STRING,
    addressField2: DataTypes.STRING,
    addressField3: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        User.belongsTo(models.civility);
        User.belongsTo(models.userType);
        User.belongsTo(models.studentYear);
        User.belongsTo(models.town,{as:'addressTown'});
        User.hasMany(models.document,{as:'Pictures'});
        User.hasMany(models.document,{as:'Documents'});
        User.hasMany(models.note,{as:'Notes'});
      }
    }
  });
  return User;
};
