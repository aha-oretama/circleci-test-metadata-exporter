/* eslint-disable no-console */
const commander = require('commander');
const db = require("../../db/models");
const {CircleCI, GitType} = require('circleci-api');

commander.requiredOption('-t, --token <token>', 'Required. Set your CircleCI token, https://circleci.com/docs/2.0/api-developers-guide/#add-an-api-token');
commander.requiredOption('-n, --name <jobName>', 'Required. Set your job name including test meta data.')
commander.option('-b, --branch <branch>', "Optional. Set your GitHub's branch.", 'master')
commander.option('-m, --max-bulk <maxBulk>', "Optional. Specify the max number of bulk times when 1 bulk get 100 records at a time. In order to avoid CircleCI API has rate limit, https://circleci.com/docs/api/v1/#rate-limiting", 5);
commander
  .usage('[options] <owner> <repo>')
  .description('Export CircleCI test metadata');

const getOptions = (owner, repo, token, branch) => {
  return {
    // Required for all requests
    token, // Set your CircleCi API token

    // Optional
    // Anything set here can be overriden when making the request

    // Git information is required for project/build/etc endpoints
    vcs: {
      type: GitType.GITHUB, // default: github
      owner,
      repo
    },

    // Optional query params for requests
    options: {
      branch, // default: master
      filter: "completed"
    }
  }
}

const getRecentBuildNum = async (client) => {
  const [build] = await client.builds({limit: 1}); // 100 is maximum
  console.log("Recent build_num: ", build.build_num);
  return build.build_num;
}

const getOldestOffset = async (client, targetBuildNum, initOffset) => {
  console.log("searching oldest offset...");
  const recursiveOffset = async (span, offset) => {
    if (span < 100) { // 100 is maximum in api parameter
      console.log("finish searching oldest offset: ", offset);
      return offset;
    }

    let [build] = await client.builds({limit: 1, offset});
    let direction;
    let condition;
    if (!build || targetBuildNum > build.build_num) {
      direction = -1;
      condition = () => !build || targetBuildNum > build.build_num
    } else if (targetBuildNum <= build.build_num) {
      direction = +1;
      condition = () => build && targetBuildNum <= build.build_num
    }

    let previousOffset;
    let currentOffset = offset;
    while (currentOffset + (span * direction) > 0 && condition()) {
      currentOffset += (span * direction);
      console.log('offset', currentOffset);
      [build] = await client.builds({limit: 1, offset: currentOffset});
      console.log("build:", build ? build.build_num : 'null');
      previousOffset = currentOffset;
    }

    await recursiveOffset(span / 10, currentOffset)
  }

  // get number of digit, https://stackoverflow.com/questions/14879691/get-number-of-digits-with-javascript
  const digit = Math.log(initOffset) * Math.LOG10E + 1 | 0;
  // initSpan should has same digit number as initOffset in order to find target offset quickly
  const initSpan = Math.pow(10, digit - 1);
  return recursiveOffset(initSpan, initOffset);
}

const execute = async () => {
  commander.parse(process.argv);

  const [owner, repo] = commander.args;
  const options = commander.opts();
  if (!owner || !repo) {
    console.error('The parameters of owner, repo are not specified. Set owner and repository name of GitHub.')
    commander.outputHelp()
    return 1;
  }

  const client = new CircleCI(getOptions(owner, repo, options.token, options.branch));
  const recentBuildNum = await getRecentBuildNum(client);
  const insertedMaxNum = await db.job.max('build_num') || 0;
  const offset = await getOldestOffset(client, insertedMaxNum, recentBuildNum - insertedMaxNum);

  for (let i = 1; i <= options.maxBulk ; i++) {
    console.log(`start ${i}th bulk...`);
    // https://circleci.com/docs/api/#recent-builds-for-a-single-project
    const builds = await client.builds({limit: 100, offset: offset - i * 100}); // 100 is maximum
    const testMetaBuilds = builds
      .filter(build => (build.job_name === options.name) || build.workflows.job_name === options.name);

    const transaction = await db.sequelize.transaction();
    try {
      for (const build of testMetaBuilds) {
        const {tests, exceptions} = await client.getTestMetadata(build.build_num);
        await db.job.upsert({
          build_num: build.build_num,
          subject: build.subject,
          status: build.status,
          build_time_millis: build.build_time_millis,
          queued_at: Date(build.queued_at),
          start_time: Date(build.start_time),
          stop_time: Date(build.stop_time),
          parallel: build.parallel,
          build_url: build.build_url
        })
        for (const test of tests) {
          await db.test_meta_data.upsert({
            name: test.name,
            build_num: build.build_num,
            file: test.file,
            classname: test.classname,
            source: test.source,
            result: test.source,
            run_time: test.run_time,
            message: test.message
          })
        }
      }
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      console.error(e);
      return 1;
    }
  }

  return 0;
};

module.exports = execute;
