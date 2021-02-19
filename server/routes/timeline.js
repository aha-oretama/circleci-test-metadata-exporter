const db = require("../../db/models");

const timeline = async (req, res) => {
  const jobs = await db.job.findAll({
    attributes: [
      'build_num',
      'subject',
      'status',
      'build_time_millis',
      'queued_at',
      'start_time',
      'stop_time',
      [db.Sequelize.fn('COUNT', db.Sequelize.col('*')), 'total_test_count'],
      [db.Sequelize.fn('SUM', db.Sequelize.col('test_meta_data.run_time')), 'total_tests_run_time'],
      [db.Sequelize.fn('SUM', db.Sequelize.literal('CASE WHEN test_meta_data.result = \'success\' THEN 1 ELSE 0 END')), 'total_success_count'],
      [db.Sequelize.fn('SUM', db.Sequelize.literal('CASE WHEN test_meta_data.result = \'skipped\' THEN 1 ELSE 0 END')), 'total_skipped_count'],
      [db.Sequelize.fn('SUM', db.Sequelize.literal('CASE WHEN test_meta_data.result = \'failure\' THEN 1 ELSE 0 END')), 'total_failure_count'],
    ],
    include: {association: db.job.associations.test_meta_data, attributes: []},
    group: ['build_num']
  });

  // total_success_count etc. returns string type. So convert the type here
  // Maybe related to https://github.com/sidorares/node-mysql2/issues/795
  const formatJobs = jobs.map(j => ({
    ...j.dataValues,
    total_tests_run_time: parseFloat(j.dataValues.total_tests_run_time),
    total_success_count: parseInt(j.dataValues.total_success_count),
    total_skipped_count: parseInt(j.dataValues.total_skipped_count),
    total_failure_count: parseInt(j.dataValues.total_failure_count),
  }))
  res.send(formatJobs);
}

exports.timeline = timeline;
