const bcrypt = require('bcrypt');
const express = require('express');
const { body } = require('express-validator');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const cors = require('cors');
const logger = require('./utils/logger');
const apiErrorReporter = require('./utils/apierrorreporter');
var config = require('../config.json');
const redis = require('./utils/redisclient');
const app = express();

app.use(cors());
app.use(express.json());
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

app.post(
    '/login',
    [
        body().isObject(),
        body('email').isEmail(),
        body('password').isString(),
        apiErrorReporter,
    ],
    async (req, res) => {
        const { email, password } = req.body;
        // Need to escape . and @ in the email address when searching.
        const emailAddress = email.replace(/\./g, '\\.').replace(/\@/g, '\\@');
        const searchResults = await redis.performSearch(redis.getKeyName('usersidx'), `@email:{${emailAddress}}`, 'RETURN', '1', 'password');

        // Valid searchResults looks like [ { password: 'ssssh' } ] but the password has
        // been encrypted with bcrypt (the dataloader encrypts passwords when loading data).
        if (searchResults.length === 1) {
            const passwordCorrect = await bcrypt.compare(password, searchResults[0].password);

            if (passwordCorrect) {
                logger.info(`Successful login for ${email}.`);
                req.session.user = email;
                return res.send('OK');
            }
        }
        // if not successful login... then destroy any sessions
        req.session.destroy();
        logger.info(`Failed login attempt for ${email}.`);
        return res.status(401).send('Invalid login.');
    },
);

app.get(
    '/logout',
    (req, res) => {
        const { user } = req.session;
        req.session.destroy((err) => {
            if (err) {
                logger.error('Error performing logout:');
                logger.error(err);
            } else if (user) {
                logger.info(`Logged out user ${user}.`);
            } else {
                logger.info('Logout called by a user without a session.');
            }
        });

        res.send('OK');
    },
);

const port = config.auth.port;
app.listen(port, () => {
    logger.info(`Authentication service listening on port ${port}.`);
});
