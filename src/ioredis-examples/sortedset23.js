const Redis = require("ioredis");
const redis = new Redis();

/*******************************************************************
    sortedSet23         Jeff Chris  Bob Alex Tom               59.5    77      80      99.5    100
    zrange(2,3)         return 

*******************************************************************/
async function main() {
    const scores = [
        { name: "Bob", score: 80 },
        { name: "Jeff", score: 59.5 },
        { name: "Tom", score: 100 },
        { name: "Alex", score: 99.5 },
        { name: "Chris", score: 77 }
    ];
    await redis.zadd("sortedset23", ...scores.map(({ name, score }) => [score, name]));

    console.log(await redis.zrange("sortedset23", 2, 3));       // return 2nd & 3rd rank
    console.log(await redis.zrange("sortedset23", 2, 3, "WITHSCORES"));
    console.log(await redis.zrange("sortedset23", 2, 4, "REV"));
    console.log(await redis.zrange("sortedset23", 80, 100, "BYSCORE"));
    
    // redis.del("sortedSet23");
    redis.quit();
    process.exit();
}

main();