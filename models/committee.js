'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class committee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  committee.init({
    chamber: DataTypes.STRING,
    name: DataTypes.STRING,
    systemCode: DataTypes.STRING,
    committeeTypeCode: DataTypes.STRING,
    bills: DataTypes.STRING,
    billsCount: DataTypes.INTEGER,
    history: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.STRING)),
    communications: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.STRING)),
    parent: DataTypes.JSON,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'committee',
  });
  return committee;
};