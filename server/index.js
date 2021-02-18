const express = require( 'express');
const bodyParser = require('body-parser');
const { getRecentDuration } = require('./routes/recentDuration');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// user
app.get('/api/recent-duration', getRecentDuration);

// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`Listening on port ${port}`));
