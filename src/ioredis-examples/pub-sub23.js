const express = require('express');
const app = express();
const bodyParser= require('body-parser');
app.use(bodyParser.json());
const port = 12237;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
app.get('/', (req, res) => {
    res.send('base path setup ayindi');
});

const Redis = require("ioredis");
const redis = new Redis({
    port: 6379,
    host: "127.0.0.1"
});

app.post("/publish23", async (req, res) => {
    let subscriberCount = await redis.publish("pub_football12", JSON.stringify({ ...req.body }));
    return res.status(200).send({ time: new Date().toISOString(), info23: subscriberCount });
});