const express = require( 'express');
const bodyParser = require('body-parser');
const {skippedTests} = require("./routes/skippedTests");
const {failureTests} = require("./routes/failureTests");
const {timeline} = require("./routes/timeline");
const { getLatestTest } = require('./routes/latestTest');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/latest', getLatestTest);
app.get('/api/timeline', timeline)
app.get('/api/failure-tests', failureTests);
app.get('/api/skipped-tests', skippedTests);

// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`Listening on port ${port}`));
