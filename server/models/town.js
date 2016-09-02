'use strict';
module.exports = function(sequelize, DataTypes) {
  var Town = sequelize.define('town', {
    name: DataTypes.STRING,
    otherName: DataTypes.STRING,
    postalCode: DataTypes.STRING,
    inseeCode: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Town.belongsTo(models.country);
      }
    }
  });
  return Town;
};
