const Redis = require("ioredis");
const redis = new Redis();

async function main() {

    /*
        sadd            create a set
        scard           returns the cardinality (num of elements in the set)
        sismember       whether an element is present in set
        smembers        list of all members in the set
        
        sdiff           different elements in two sets
        sinter          common elements in three sets (key1, key2, key3)
        
        smove           move an element from one set to another
        spop            remove 1 (or) more random elements from the set
        srem            remove the "given" element from the set

    */
    const numbers = [1, 3, 5, 7, 9];
    await redis.sadd("userSet23", numbers);

    const elementCount = await redis.scard("userSet23");
    console.log("total elements & elements =====> ", elementCount, await redis.smembers("userSet23")); // 5

    let addedResult = await redis.sadd("userSet23", "1");
    const newElementCount = await redis.scard("userSet23");
    console.log("new element (duplicate isnt added)", addedResult, newElementCount); // 5

    const isMember = await redis.sismember("userSet23", 3);
    console.log("isMemeber (or) not ====> ", isMember);              // 1 means true

    await redis.sadd("football12:laliga:clubs", ['RMA', 'Bar', 'Atleti']);
    await redis.sadd("football12.uclwinning:clubs", ['RMA', 'Bar']);
    console.log('non winners23 ====> ', await redis.sdiff("football12:laliga:clubs", "football12.uclwinning:clubs"));
    await redis.sdiffstore("football12.laliga.nonuclwinners", "football12:laliga:clubs", "football12.uclwinning:clubs");
    console.log("sdiffstore ====> ", await redis.smembers("football12.laliga.nonuclwinners"));

    await redis.sadd("set23_key1_rm", ['Luka', 'Kroos', 'Benz', 'CR7']);
    await redis.sadd("set23_key1_manu", ['CR7', 'Varane', 'Casemiro', 'degea']);
    await redis.sadd("set23_key1_juv", ['Buffon', 'CR7']);
    console.log("intersection23 ===> ", await redis.sinter("set23_key1_rm", "set23_key1_manu", "set23_key1_juv"));

    await redis.del("userSet23");
    await redis.del("football12:laliga:clubs");
    await redis.del("football12:uclwinning:clubs");
    await redis.del("football12.laliga.nonuclwinners");
    await redis.del("set23_key1_rm");
    await redis.del("set23_key1_manu");
    await redis.del("set23_key1_juv");
    await redis.quit();
    process.exit();
}

main();