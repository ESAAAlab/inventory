'use strict';
module.exports = function(sequelize, DataTypes) {
  var InventoryItem = sequelize.define('item', {
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true
    },
    serialNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    materialCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    barcode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    inventoryNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    acquisitionPrice: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    acquisitionDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isConsummable: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    stockMax: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    stockAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    stockStep: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    stockUnit: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        InventoryItem.belongsTo(models.itemCategory);
        InventoryItem.belongsTo(models.supplier);
        InventoryItem.belongsTo(models.supplier,{as:'manufacturer'});
        InventoryItem.belongsTo(models.itemLocation);
        InventoryItem.hasMany(models.note,{as:'Notes'});
        InventoryItem.hasMany(models.document,{as:'Pictures'});
        InventoryItem.hasMany(models.document,{as:'Documents'});
        InventoryItem.hasMany(models.note,{as:'Maintenance'});
        InventoryItem.hasMany(models.note,{as:'Commentary'});
        InventoryItem.hasMany(models.transaction);
      }
    }
  });
  return InventoryItem;
};
