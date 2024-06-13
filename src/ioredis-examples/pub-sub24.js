const Redis = require("ioredis");
const redis = new Redis();

const main = () => {
    redis.subscribe("pub_football12", (err, count) => {
        if (err) console.error(err.message);
        console.log(`Subscribed23 to ====> ${count} channels.`);
    });

    redis.on("message", (channel, message) => {
        console.log(`rcvd message23 ===> ${channel}, ${message}`);
    });
};

main();

/*
    subscribers are not guaranteed to receive messages. 
    - if the subscriber is experiencing network connection issues or 
    - subscriber isnt able to read the messages fast enough
    the data from the publisher will be lost.


    BETTER APPROACH
    - buffer the events in a Redis list
    - and rely on our subscriber to empty the Redis list. 
    - During those times when the subscriber was unavailable, 
    - the events would continue to buffer in the Redis list for the subscriber to retrieve

*/