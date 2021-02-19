const moment = require("moment");
const db = require("../../db/models");

const recentDays = 30;

const failureTests = async (req, res) => {
  const maxDate = await db.job.max('start_time');
  const jobs = await db.job.findAll({
    raw: true,
    attributes: [
      'test_meta_data.name',
      'test_meta_data.classname',
      [db.Sequelize.fn('COUNT', db.Sequelize.col('*')), 'total_test_count'],
      [db.Sequelize.fn('SUM', db.Sequelize.literal('CASE WHEN test_meta_data.result = \'failure\' THEN 1 ELSE 0 END')), 'total_failure_count'],
    ],
    include: {
      association: db.job.associations.test_meta_data,
      attributes: [],
    },
    where: {
      start_time: {
        [db.Sequelize.Op.gte]: moment(maxDate).subtract(recentDays, "days")
      }
    },
    group: ['test_meta_data.name', 'test_meta_data.classname'],
    having: db.Sequelize.literal('total_failure_count > 0')
  });

  console.log(jobs);
  const formatJobs = jobs.map(j => ({
    ...j,
    total_failure_count: parseInt(j.total_failure_count),
  }))
  res.send(formatJobs);
}

exports.failureTests = failureTests;
