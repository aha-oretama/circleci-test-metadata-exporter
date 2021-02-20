const {QueryTypes} = require("sequelize");
const db = require("../../db/models");

/**
 * This API returns the only skipped tests in the last build with the information the test started to be skipped
 */
const skippedTests = async (req, res) => {
  const maxBuildNum = await db.job.max('build_num');
  const jobWithSkippedTest = await db.job.findOne({
      attributes: ["queued_at"],
      where: {
        build_num: maxBuildNum
      },
      include: {
        association: db.job.associations.test_meta_data,
        where: {
          result: 'skipped'
        }
      }
    }
  );

  if(!jobWithSkippedTest || !jobWithSkippedTest.test_meta_data) {
    res.send([]);
    return;
  }

  const test_meta_data = jobWithSkippedTest.test_meta_data
  const longesSkippedTests = await db.sequelize.query(`
  SELECT name, MAX(queued_at) AS first_skipped_at
    FROM (
      SELECT
        jobs.build_num as build_num,
        name,
        queued_at,
        result,
        LEAD(result) OVER (PARTITION BY name ORDER BY jobs.build_num DESC) as lead_result  
      FROM
        jobs JOIN test_meta_data
      ON
        jobs.build_num =test_meta_data.build_num ) AS LEAD_TABLE
    WHERE
      name IN (:tests)
    AND
      result = "skipped"
    AND
      (lead_result != "skipped" OR lead_result IS NULL)
    GROUP BY
      name
  `, {
    replacements: { tests: test_meta_data.map(d => d.name)},
    type: QueryTypes.SELECT
  });
  const result = longesSkippedTests.map(test => ({...test,last_skipped_at: jobWithSkippedTest.queued_at}));
  res.send(result);
}

exports.skippedTests = skippedTests;
