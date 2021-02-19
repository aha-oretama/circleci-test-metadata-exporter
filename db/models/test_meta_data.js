'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class test_meta_data extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  test_meta_data.init({
    name: DataTypes.STRING,
    build_num: DataTypes.INTEGER,
    file: DataTypes.STRING,
    classname: DataTypes.STRING,
    source: DataTypes.STRING,
    result: DataTypes.STRING,
    run_time: DataTypes.DECIMAL(10, 3),
    message: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'test_meta_data',
    underscored: true,
  });
  return test_meta_data;
};
