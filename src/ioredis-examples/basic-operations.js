const Redis = require("ioredis");
const redis = new Redis({
    port: 6379,
    host: "127.0.0.1"
});

/********************************************************************************/
// ioredis supports all Redis commands:
redis.set("club23", "RMA");            // returns promise which resolves to string, "OK"

// ioredis supports the node.js callback style
redis.get("club23", (err, result) => {
    if (err) console.error(err); 
    else console.log("club23 callback ====> ", result);               // Promise resolves to "bar"
});

// Or ioredis returns a promise if the last argument isn't a function
redis.get("club23").then((result) => {
    console.log("club23 promise =====> ", result);
});

redis.del("club23");
/********************************************************************************/




/********************************************************************************/



// // Arguments to commands are flattened, so the following are the same:
// redis.sadd("set", 1, 3, 5, 7);
// redis.sadd("set", [1, 3, 5, 7]);
// redis.spop("set"); // Promise resolves to "5" or another item in the set




/********************************************************************************/


// // Most responses are strings, or arrays of strings
// redis.zadd("sortedSet", 1, "one", 2, "dos", 4, "quatro", 3, "three");
// redis.zrange("sortedSet", 0, 2, "WITHSCORES").then((res) => console.log(res)); // Promise resolves to ["one", "1", "dos", "2", "three", "3"] as if the command was ` redis> ZRANGE sortedSet 0 2 WITHSCORES `

// // Some responses have transformers to JS values
// redis.hset("myhash", "field1", "Hello");
// redis.hgetall("myhash").then((res) => console.log(res)); // Promise resolves to Object {field1: "Hello"} rather than a string, or array of strings

// // All arguments are passed directly to the redis server:
// redis.set("key", 100, "EX", 10); // set's key to value 100 and expires it after 10 seconds

// // Change the server configuration
// redis.config("SET", "notify-keyspace-events", "KEA");