'use strict';
module.exports = function(sequelize, DataTypes) {
  var InventoryItem = sequelize.define('item', {
    name: DataTypes.STRING,
    model: DataTypes.STRING,
    brand: DataTypes.STRING,
    serialNumber: DataTypes.STRING,
    materialCode: DataTypes.STRING,
    barcode: DataTypes.STRING,
    inventoryNumber: DataTypes.STRING,
    acquisitionPrice: DataTypes.DOUBLE,
    acquisitionDate: DataTypes.DATE,
    description: DataTypes.STRING,
    isConsummable: DataTypes.BOOLEAN,
    stockMax: DataTypes.DOUBLE,
    stockAvailable: DataTypes.BOOLEAN,
    stockStep: DataTypes.DOUBLE,
    stockUnit: DataTypes.STRING
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
