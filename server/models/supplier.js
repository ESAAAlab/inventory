'use strict';
module.exports = function(sequelize, DataTypes) {
  var Supplier = sequelize.define('supplier', {
    companyName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isManufacturer: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    addressStreetNum: {
      type: DataTypes.STRING,
      allowNull: true
    },
    addressField1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    addressField2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    addressField3: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        Supplier.hasMany(models.user,{as:'Contacts'});
        Supplier.hasMany(models.document,{as:'Pictures'});
        Supplier.hasMany(models.document,{as:'Documents'});
        Supplier.hasMany(models.note,{as:'Notes'});
        Supplier.belongsTo(models.town,{as:'addressTown'});
      }
    }
  });
  return Supplier;
};
