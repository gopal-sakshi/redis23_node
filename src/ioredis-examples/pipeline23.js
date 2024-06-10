const Redis = require("ioredis");
const redisClient = new Redis();

const pipeline = redisClient.pipeline();
const rmPlayers = ['Courtois', 
    'Carva', 'Rudiger', 'Alaba', 'Mendy', 
    'Modric', 'Tchoumeni', 'Kroos', 
    'Rodrygo', 'Bellingham', 'Vini'];

(async function blah23() {
    for(let i=0; i<11; i++) {
        // await redisClient.set(`rmPlayers_${i}`, rmPlayers[i])        // 11 requests will be sent to redis server
        await pipeline.set(`rmPlayers_${i}`, rmPlayers[i]);             // set the pipeline(); pipeline.exec() - ONLY 1 request 
    }
    const responses = await pipeline.exec();
    console.log("responses using pipeline ====> ", responses);
    await redisClient.quit();
    process.exit();
})();
