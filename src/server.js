var config = require('../config.json');
const express = require('express');
const cors = require('cors');
const routes = require('./routes');


const app = express();

app.use(cors());
app.use('/api', routes);

// Check for required environment variables.
if (process.env.WEATHER_API_KEY === undefined) { console.warn('Warning: Environment variable WEATHER_API_KEY is not set!'); }

const port = config.application.port;
app.listen(port, () => { console.log(`Application listening on port ${port}.`); });
