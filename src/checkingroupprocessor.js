const fs = require('fs');
const redis = require('./utils/redisclient');
const logger = require('./utils/logger');
const sleep = require('./utils/sleep');

const CONSUMER_GROUP_NAME = 'checkinConsumers';
const redisClient = redis.getClient();

const loadLuaScript = async () => {
    redisClient.defineCommand('processCheckin', {
        numberOfKeys: 2,
        lua: fs.readFileSync('src/scripts/checkinprocessor.lua').toString(),
    });
};

const runCheckinGroupProcessor = async (consumerName) => {
    logger.info(`${consumerName}: Starting up.`);

    loadLuaScript();

    const checkinStreamKey = redis.getKeyName('checkins');

    while (true) {
        const response = await redisClient.xreadgroup('GROUP', CONSUMER_GROUP_NAME, consumerName, 'COUNT', '1', 'BLOCK', '5000', 'STREAMS', checkinStreamKey, '>');

        if (response) {
            const streamEntry = response[0][1][0];
            const fieldNamesAndValues = streamEntry[1];

            const checkin = {
                id: streamEntry[0],
                timestamp: streamEntry[0].split('-')[0],
            };

            console.log(`${consumerName}: Processing checkin ${checkin.id}.`);

            for (let n = 0; n < fieldNamesAndValues.length; n += 2) {
                const k = fieldNamesAndValues[n];
                const v = fieldNamesAndValues[n + 1];
                checkin[k] = v;
            }

            const checkinId = checkin.id;
            const userKey = redis.getKeyName('users', checkin.userId);
            const locationKey = redis.getKeyName('locations', checkin.locationId);

            console.log(`${consumerName}: Processing23 =====> ${checkinId}.`);
            console.log(`${consumerName}: Updating23 ===> user ${userKey} and location ${locationKey}.`);

            await redisClient.processCheckin(userKey, locationKey, checkin.timestamp, checkin.locationId, checkin.starRating);

            // Acknowledge that we have processed this entry.
            const ack = await redisClient.xack(checkinStreamKey, CONSUMER_GROUP_NAME, checkinId);

            console.log(`${consumerName}: ${ack === 1 ? 'Acknowledged' : 'Error acknowledging'} processing of checkin ${checkinId}.`);

            // Pretend to do something that takes time...
            console.log(`${consumerName}: Pausing23 to simulate work.`);
            await sleep.randomSleep(1, 5);
        } else {
            console.log(`${consumerName}: waiting23 for more checkins...`);
        }
    }
};

if (process.argv.length !== 3) {
    logger.error('Usage: npm run checkingroupprocessor <consumerName>');
    process.exit(1);
}

runCheckinGroupProcessor(process.argv[2]);
