'use strict';
module.exports = function(sequelize, DataTypes) {
  var Document = sequelize.define('document', {
    type: DataTypes.STRING,
    content: DataTypes.STRING
  });
  return Document;
};
