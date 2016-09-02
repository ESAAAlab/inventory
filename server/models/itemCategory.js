'use strict';
module.exports = function(sequelize, DataTypes) {
  var Category = sequelize.define('itemCategory', {
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
  return Category;
};
