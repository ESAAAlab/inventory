'use strict';
module.exports = function(sequelize, DataTypes) {
  var Transaction = sequelize.define('transaction', {
    type: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    quantity: DataTypes.DOUBLE,
    effectiveEndDate: DataTypes.DATE,
    ended: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        Transaction.hasMany(models.note,{as:'Notes'});
        Transaction.hasMany(models.document,{as:'Pictures'});

        Transaction.belongsTo(models.user,{as:'lender'});
        Transaction.belongsTo(models.user,{as:'lendee'});

        Transaction.belongsToMany(models.item,{as: 'items', through:'itemStock'});
        Transaction.belongsToMany(models.item,{as: 'items', through:'itemLending'});
      }
    }
  });
  return Transaction;
};
