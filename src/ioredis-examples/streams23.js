const Redis = require("ioredis");
const redis = new Redis({
    port: 6379,
    host: "127.0.0.1"
});
/**************************************************************************/
// const express = require('express');
// const app = express();
// const bodyParser= require('body-parser');
// app.use(bodyParser.json());

// const port = 12236;
// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`);
// });
// app.get('/', (req, res) => {
//     res.send('base path setup ayindi');
// });
// app.get('/getFeed23', async (req, res) => {
//     let messages = await redis.xread(["STREAMS", "ipl23", 0]);
//     res.send({
//         time23: new Date().toISOString(),
//         messages23: messages
//     })
// });
// app.post('/postFeed23', async (req, res) => {
//     let res22 = await redis.xadd("ipl23", "*", req.body.msg22, req.body.type);
//     res.status(200).send({ time23: new Date().toISOString(), info: res22 })
// });
/**************************************************************************/
// https://redis.io/topics/streams-intro


async function main() {
    const channel = "ipl23";
    let messageCount = await redis.xlen(channel);
    console.log(`current message count in channel23 ${channel} ====> ${messageCount}`);

    // specify channel to write a message into, messages are key value
    const myMessage1 = "kkr are top in ipl2024";
    const myMessage2 = "rcb vs csk decides the 4th place";
    const myMessage3 = "impact player rule affected allrounder dvpt"
    await redis.xadd(channel, "*", myMessage1, "message");
    await redis.xadd(channel, "*", myMessage2, "message");
    await redis.xadd(channel, "*", myMessage3, "message");
    messageCount = await redis.xlen(channel);
    console.log(`current message count in channel ${channel} ====> ${messageCount}`);


    // use xrange directly in redis-cli         XRANGE ipl23 - +

    // use xread to read all messages in channel
    let messages = await redis.xread(["STREAMS", channel, 0]);
    messages = messages[0][1];
    console.log(`\nreading messages from channel ${channel}, found ${messages.length} messages`);
    for (let i = 0; i < messages.length; i++) {
        let msg = messages[i];
        msg = msg[1][0].toString();
        console.log("reading message:", msg);
    }

    await redis.del("ipl23")
    await redis.quit();
    // process.exit(0);
}

// main();