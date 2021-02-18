const db = require("../../db/models");

const getRecentDuration = async (req, res) => {
  const job = await db.job.findOne({
    where: {
      build_num: {
        [db.Sequelize.Op.in]: [db.Sequelize.literal('SELECT MAX(build_num) FROM jobs')]
      }
    },
    include: db.job.associations.test_meta_data
  })
  if(!job) {
    res.send([]);
  }

  console.log(job.test_meta_data[0]);
  const results = job.test_meta_data.map(data => ({
    name: data.name || data.classname,
    run_time: data.run_time
  }));

  res.send(results);
};

exports.getRecentDuration = getRecentDuration;
