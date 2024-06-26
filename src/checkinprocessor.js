const redis = require('./utils/redisclient');
const logger = require('./utils/logger');
const sleep = require('./utils/sleep');

const runCheckinProcessor = async () => {
    const redisClient = redis.getClient();
    const checkinStreamKey = redis.getKeyName('checkins');
    const checkinProcessorIdKey = redis.getKeyName('checkinprocessor', 'lastid');
    const delay = process.argv[3] === 'delay';

    let lastIdRead = await redisClient.get(checkinProcessorIdKey);
    if (lastIdRead == null) {
        lastIdRead = 0;
    }

    console.log(`Reading stream23 from last ID ${lastIdRead}.`);

    while (true) {
        const response = await redisClient.xread('COUNT', '1', 'BLOCK', '5000', 'STREAMS', checkinStreamKey, lastIdRead);
        
        /*****************************************************
        
        If a stream entry was read, response looks like:
        [
            [ 
                "ncc:checkins",
                [
                    [ 
                        "1609602085397-0",
                        [ "locationId","171","userId","789","starRating","5" ]
                    ]
                ]
            ]
        ]

        ******************************************************/

        if (response) {
            const checkinData = response[0][1][0];
            const fieldNamesAndValues = checkinData[1];

            const checkin = {
                id: checkinData[0],
                timestamp: checkinData[0].split('-')[0],
            };

            for (let n = 0; n < fieldNamesAndValues.length; n += 2) {
                const k = fieldNamesAndValues[n];
                const v = fieldNamesAndValues[n + 1];
                checkin[k] = v;
            }

            const userKey = redis.getKeyName('users', checkin.userId);                  // ncc:users:789
            const locationKey = redis.getKeyName('locations', checkin.locationId);      // ncc:locations:171

            console.log(`Updating23 user ${userKey} and location ${locationKey}`);

            let pipeline = redisClient.pipeline();

            pipeline.hset(userKey, 'lastCheckin', checkin.timestamp, 'lastSeenAt', checkin.locationId);
            pipeline.hincrby(userKey, 'numCheckins', 1);
            pipeline.hincrby(locationKey, 'numCheckins', 1);
            pipeline.hincrby(locationKey, 'numStars', checkin.starRating);

            const responses = await pipeline.exec();

            // Calculate new averageStars... 
            // using the 3rd and 4th response values from the pipeline (location numCheckins & location numStars).
            const locationNumCheckins = responses[2][1];
            const locationNumStars = responses[3][1];

            const newAverageStars = Math.round(locationNumStars / locationNumCheckins);
            lastIdRead = checkin.id;

            pipeline = redisClient.pipeline();
            pipeline.hset(locationKey, 'averageStars', newAverageStars);
            pipeline.set(checkinProcessorIdKey, lastIdRead);

            await pipeline.exec();

            console.log(`Processed checkin23 ===> ${checkin.id}.`);

            // Simulate some time consuming "work"...
            if (delay) {
                await sleep.randomSleep(1, 10);
            }
        } else {
            console.log('Waiting for more checkins23 =======> ', new Date().toISOString());
        }
    }
};

runCheckinProcessor();
