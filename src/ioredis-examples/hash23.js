const Redis = require("ioredis");
const redis = new Redis({
    port: 6379,
    host: "127.0.0.1"
});

async function main() {
    const realMadrid23 = {
        name: "Real Madrid CF",
        manager: "Carlo Ancelotti",
        laligaTitles: 36,
        uefaClTitles: 14,
        stadium: 'Bernabeu'
    };

    await redis.hset("rma", realMadrid23);

    const manager = await redis.hget("rma", "manager");
    const laligaTitles = await redis.hget("rma", "laligaTitles");
    const all = await redis.hgetall("rma");

    console.log("manager name ====> ", manager);
    console.log("laligaTitles ====> ", laligaTitles);
    console.log("all =============> ", all);
    
    /****************************************************        
        hexists         check if a key exists (or) not
        hincrby         increment a key
        hsetnx          set a key
        hlen            total keys in 'RMA' hash
        hkeys, hvals
        hstrlen         length of string of key's value
        hmset, hmget

    ****************************************************/
    await redis.hdel("rma", ["laligaTitles", "stadium"]);
    const exists = await redis.hexists("rma", "stadium");
    console.log("exists ===> ", exists);                    // 0 means false

    await redis.hincrby("rma", "uefaClTitles", 1);
    const newCLTitles = await redis.hget("rma", "uefaClTitles");
    console.log("newCLTitles ====> ", newCLTitles);

    await redis.hsetnx("rma", "address", 'Madrid, Spain');
    console.log("address23 ====> ", await redis.hget("rma", "address"));

    console.log("total keys in hash - 'RMA' ===> ", await redis.hlen("rma"));

    console.log("hkeys in hash - 'RMA' ===>  ", await redis.hkeys("rma"));
    console.log("hvals in hash - 'RMA' ===>  ", await redis.hvals("rma"));
    console.log("hstrleng in hash - 'RMA' ===> ", await redis.hstrlen("rma", "captain"))

    console.log("hmset =====> ", await redis.hmset("rma", { captain: "Nacho", rivals: ["Barca", "Atleti"] }));
    console.log("hmget (multiple get) ====> ", await redis.hmget("rma", ["captain", "rivals", "manager"]));

    redis.quit();
    process.exit(0)
}

main();