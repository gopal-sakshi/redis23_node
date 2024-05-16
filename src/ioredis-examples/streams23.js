const Redis = require("ioredis");
const redis = new Redis({
    port: 6379,
    host: "127.0.0.1"
});

// https://redis.io/topics/streams-intro


async function main() {
    const channel = "ipl23";
    let messageCount = await redis.xlen(channel);
    console.log(`current message count in channel ${channel} ====> ${messageCount}`);

    // specify channel to write a message into, messages are key value
    const myMessage1 = "kkr are top in ipl2024";
    const myMessage2 = "rcb vs csk decides the 4th place";
    const myMessage3 = "impact player rule affected allrounder dvpt"
    await redis.xadd(channel, "*", myMessage1, "message");
    await redis.xadd(channel, "*", myMessage2, "message");
    await redis.xadd(channel, "*", myMessage3, "message");
    messageCount = await redis.xlen(channel);
    console.log(`current message count in channel ${channel} ====> ${messageCount}`);


    // use xread to read all messages in channel
    let messages = await redis.xread(["STREAMS", channel, 0]);
    messages = messages[0][1];
    console.log(`\nreading messages from channel ${channel}, found ${messages.length} messages`);
    for (let i = 0; i < messages.length; i++) {
        let msg = messages[i];
        msg = msg[1][0].toString();
        console.log("reading message:", msg);
    }

    process.exit(0);
}

main();