'use strict';
module.exports = function(sequelize, DataTypes) {
  var Category = sequelize.define('itemCategory', {
    description: DataTypes.STRING
  });
  return Category;
};
