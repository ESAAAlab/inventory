'use strict';
module.exports = function(sequelize, DataTypes) {
  var Civility = sequelize.define('civility', {
    description: DataTypes.STRING
  });
  return Civility;
};
