'use strict';
module.exports = function(sequelize, DataTypes) {
  var Country = sequelize.define('country', {
    commonName: DataTypes.STRING,
    phoneCode: DataTypes.STRING,
    countryCode: DataTypes.STRING
  });
  return Country;
};
