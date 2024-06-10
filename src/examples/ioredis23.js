const Redis = require('ioredis');

/*
    Multiple redis databases
    - https://stackoverflow.com/questions/16221563/whats-the-point-of-multiple-redis-databases
    - https://stackoverflow.com/questions/6304955/how-to-separate-redis-database-for-same-two-app-in-node-js

*/

const redisDemo = async () => {
    const redisClient = new Redis({
        host: '127.0.0.1',
        port: 6379,
    });
    console.log("connected to redis =======================\n");

    // 01   basic set/get
    await redisClient.set('RM_captain', 'Nacho Fernandez');
    const value = await redisClient.get('RM_captain');
    console.log("get/set value =========> ", value);

    // 02   
    await redisClient.zadd("sortedSet23", 1, "okati", 2, "rendu", 4, "naalugu", 3, "moodu");
    await redisClient.zrange("sortedSet23", 0, 2, "WITHSCORES").then((elements) => { 
        console.log("zrange elements23 ====> ", elements)
    });
    await redisClient.del("sortedSet23");

    redisClient.quit();
    console.log("\ndisconnected from redis =======================");
};

redisDemo();
