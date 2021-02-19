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
      [db.Sequelize.fn('SUM', db.Sequelize.col('`test_meta_data`.run_time')), 'total_tests_run_time']
    ],
    include: {association: db.job.associations.test_meta_data, attributes: []},
    group: ['build_num']
  });

  res.send(jobs);
}

exports.countTimeline = countTimeline;
exports.timeline = timeline;
