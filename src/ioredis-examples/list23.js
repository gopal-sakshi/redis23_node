const Redis = require("ioredis");
const redis = new Redis({
    port: 6379,
    host: "127.0.0.1"
});

async function main() {
    const numbers = [1, 4, 9, 16, 25, 36, 49, 64];
    await redis.lpush("squares23", numbers);

    /***********************************************************
    squares23 =============> 64, 49, 36, 25, 16, 9, 4, 1
    
    llen            length of the list
    lindex          returns the element @ 3rd index
    linsert         inserts an element before/after
    lpop            removes 1st element of the list
    lmpop           pop multiple elements
    lpush           insert vs push (notice the difference); used with ltrim to store logs
    lset            modify the element @ 3rd index
    ltrim           used with lpush (push one element; ltrim key23 0 99 ===> ensure that key23 is of 100 length)
    ***********************************************************/

    console.log("length23 ======> ", await redis.llen("squares23"));

    const index23 = await redis.lindex("squares23", 0);
    const index24 = await redis.lindex("squares23", 1);
    const index25 = await redis.lindex("squares23", 3);

    console.log("index 23, 24, 25 =========> ", index23, index24, index25);

    // if 25 doesnt exist ---> nothing happens, no insertion
    const insert24 = await redis.linsert("squares23", 'BEFORE', 25, 20);
    console.log("insert24 ==========> ", await redis.lrange("squares23", 0, -1));

    const popped = await redis.lpop("squares23"); 
    console.log("element popped ====> ", popped);
    // now squares23 ==============> [1,4,9,16,25,36,49]

    // // ERROR ===========> lmpop is not a function
    // const poppedM = await redis.lmpop("squares23", 3, 'RIGHT');
    // console.log("lmpop23 ==========> ", await redis.lrange("squares23", 0, -1));

    const lpushed = await redis.lpush("squares23", 98);
    console.log("lpushed23 ==========> ", await redis.lrange("squares23", 0, -1));

    await redis.lset("squares23", 3 , 45);
    console.log("lset23 ==========> ", await redis.lrange("squares23", 0, -1));

    // let bb1 = await redis.lrange("squares23", 0, 1);
    // let bb2 = await redis.lrange("squares23", 1, 2);
    // let bb3 = await redis.lrange("squares23", 3, 5);
    // let bb4 = await redis.lrange("squares23", 4, 2);
    // let bb5 = await redis.lrange("squares23", 4, 0);
    // console.log("bb1 ====> ", bb1);
    // console.log("bb2 ====> ", bb2);
    // console.log("bb3 ====> ", bb3);
    // console.log("bb4 ====> ", bb4);
    // console.log("bb5 ====> ", bb5);

    // const all1 = await redis.lrange("squares23", 0, 4);
    // const all2 = await redis.lrange("squares23", 0, -1);
    // console.log("first 5 elements ===> ", all1);
    // console.log("reverse order ======> ", all2);

    const position = await redis.lpos("squares23", 16);
    console.log("position of 16 =========> ", position);

    setTimeout(() => {
        // redis is in the block mode due to blpop(); so we duplicate a new connection to invoke LPUSH command.
        // blpop ===> it blocks, until lpop works; until there is an element to pop; redis connetion will block
        redis.duplicate().lpush("block-list23", "this is 1st element in bl23");
    }, 3000);
    const blockPopped = await redis.blpop("block-list23", 0);             // Resolved after 3000ms.
    console.log("blockpopped23 ===========> ", blockPopped);

    await redis.del("squares23")        // if i dont delete "squares23" key --> list is growing bigger everytime I run 
    redis.quit();
    process.exit(0);
}

main();