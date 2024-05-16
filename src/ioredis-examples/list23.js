const Redis = require("ioredis");
const redis = new Redis({
    port: 6379,
    host: "127.0.0.1"
});

async function main() {
    const numbers = [1, 4, 9, 16, 25, 36, 49, 64];
    await redis.lpush("squares23", numbers);

    const popped = await redis.lpop("squares23");
    console.log("element popped ====> ", popped);

    const all1 = await redis.lrange("squares23", 0, 4);
    const all2 = await redis.lrange("squares23", 0, -1);
    console.log("first 5 elements ===> ", all1);
    console.log("reverse order ======> ", all2);

    // const position = await redis.lpos("user-list", 5);
    // console.log(position); // 1

    // setTimeout(() => {
    //     // `redis` is in the block mode due to `redis.blpop()`,
    //     // so we duplicate a new connection to invoke LPUSH command.
    //     redis.duplicate().lpush("block-list", "hello");
    // }, 1200);
    // const blockPopped = await redis.blpop("block-list", 0); // Resolved after 1200ms.
    // console.log(blockPopped); // [ 'block-list', 'hello' ]

    process.exit(0);
}

main();