
const fetch = require('node-fetch');
const sleep = require('./utils/sleep');
var config = require('../config.json');

const CHECKIN_RECEIVER_URL = `http://localhost:${config.checkinReceiver.port}/api/checkin`;

const randomInRange = (min, max) => Math.ceil(Math.random() * (max - min) + min);

const generateCheckin = async () => {
    const checkin = {
        userId: randomInRange(1, 1000),
        locationId: randomInRange(1, 215),
        starRating: randomInRange(0, 5),
    };

    const response = await fetch(CHECKIN_RECEIVER_URL, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkin),
    });

    if (response.status === 202) {
        console.log(`Generated checkin23 ===> ${checkin.userId} @ ${checkin.locationId} & rating ${checkin.starRating}`);
    } else {
        console.log(`${response.status} error recording checkin.`);
    }
};

const runCheckinGenerator = async () => {
    console.log('Started checkin generator23 ===> ');

    // Infinitely generate checkins...
    while (true) {
        await sleep.randomSleep(2, 5);
        await generateCheckin();
    }
};

runCheckinGenerator();
