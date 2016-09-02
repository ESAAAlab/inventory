'use strict';
module.exports = function(sequelize, DataTypes) {
  var Location = sequelize.define('itemLocation', {
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Location;
};
