// To use Redis OM, you need to connect to Redis (or) Redis Stack
    // preferably Redis Stack ---> as it comes with RediSearch, RedisJSON

import { createClient } from 'redis';

// connect on default port
const redis1 = createClient();
redis1.on('error', (err) => console.log('Redis Client Error', err));
await redis1.connect();

// connect on 6380 port
const connectionObject = { url: 'redis://localhost:6380' };
const redis2 = createClient(connectionObject);



