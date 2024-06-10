const express = require('express');
const { body } = require('express-validator');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const morgan = require('morgan');
const cors = require('cors');
const logger = require('./utils/logger');
const apiErrorReporter = require('./utils/apierrorreporter');

const useAuth = process.argv[2] === 'auth';

var config = require('../config.json');

const redis = require('./utils/redisclient');

const redisClient = redis.getClient();

const app = express();
app.use(morgan('combined', { stream: logger.stream }));
app.use(cors());
app.use(express.json());

if (useAuth) {
    console.log('Authentication enabled, checkins require a valid user session23 ===> ');
    app.use(session({
        secret: config.session.secret,
        store: new RedisStore({
            client: redis.getClient(),
            prefix: redis.getKeyName(`${config.session.keyPrefix}:`),
        }),
        name: config.session.appName,
        resave: false,
        saveUninitialized: true,
    }));
} else {
    console.log('Authentication disabled, checkins do not require a valid user session23 ===> ');
}

const checkinStreamKey = redis.getKeyName('checkins');
const maxStreamLength = config.checkinReceiver.maxStreamLength;

app.post(
    '/api/checkin',
    (req, res, next) => {
        if (useAuth && !req.session.user) {
            console.log('Rejecting checkin - no valid user session found23');
            return res.status(401).send('Authentication required.');
        }
        return next();
    },
    [
        body().isObject(),
        body('userId').isInt({ min: 1 }),
        body('locationId').isInt({ min: 1 }),
        body('starRating').isInt({ min: 0, max: 5 }),
        apiErrorReporter,
    ],
    async (req, res) => {
        const checkin = req.body;
        const bloomFilterKey = redis.getKeyName('checkinfilter');
        const checkinStr = `${checkin.userId}:${checkin.locationId}:${checkin.starRating}`;

        // Check if we've seen this combination of user, location, star rating before.
        const checkinSeen = await redisClient.call('BF.EXISTS', bloomFilterKey, checkinStr);

        if (checkinSeen === 1) {
            console.log(`checkin rejected23 - details ==> ${checkin.userId}, ${checkin.locationId}, ${checkin.starRating}`);
            return res.status(422).send('Multiple identical checkins are not permitted.');
        }

        const pipeline = redisClient.pipeline();

        pipeline.call('BF.ADD', bloomFilterKey, checkinStr);
        pipeline.xadd(
            checkinStreamKey, 'MAXLEN', '~', maxStreamLength, '*', ...Object.entries(checkin).flat(),
            (err, result) => {
                if (err) {
                    console.log('Error adding checkin to stream23:');
                    console.log(err);
                } else {
                    console.log(`Received checkin23, added to stream as ${result}`);
                }
            },
        );

        pipeline.exec();

        // Accepted, as we'll do later processing on it...
        return res.status(202).end();
    },
);

const port = config.checkinReceiver.port;
app.listen(port, () => {
    logger.info(`Checkin receiver listening on port ${port}.`);
});
