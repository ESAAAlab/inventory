'use strict';
module.exports = function(sequelize, DataTypes) {
  var Note = sequelize.define('note', {
    type: DataTypes.STRING,
    description: DataTypes.STRING
  });
  return Note;
};
