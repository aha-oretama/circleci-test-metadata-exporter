const db = require("../../db/models");

const countTimeLine = async (req, res) => {
  const jobs = await db.job.findAll({
    attributes: [
      'build_num',
      'start_time',
      [db.Sequelize.fn('COUNT', 'test_metadata.id'), 'count']
    ],
    include: {association: db.job.associations.test_meta_data, attributes: []},
    group: ['build_num', 'start_time']
  })

  res.send(jobs);
}

exports.countTimeLine = countTimeLine;
