'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class job extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      job.hasMany(models.test_meta_data, { foreignKey: 'build_num' })
    }
  };
  job.init({
    build_num: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    subject: DataTypes.STRING,
    status: DataTypes.STRING,
    build_time_millis: DataTypes.INTEGER,
    queued_at: DataTypes.DATE,
    start_time: DataTypes.DATE,
    stop_time: DataTypes.DATE,
    parallel: DataTypes.INTEGER,
    build_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'job',
    underscored: true,
  });
  return job;
};
