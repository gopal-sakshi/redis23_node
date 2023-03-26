const Redis = require('ioredis');

const redisDemo = async () => {
  const redisClient = new Redis({
    host: '127.0.0.1',
    port: 6379,
  });
  
  await redisClient.set('myname', 'Simon Prickett');  
  const value = await redisClient.get('myname');
  console.log(value);  
  redisClient.quit();         // Disconnect from Redis.
};

redisDemo();
