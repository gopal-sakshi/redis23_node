// Some Redis commands


const aString = await redis.ping();                  // 'PONG'
const aNumber = await redis.hSet('foo', 'alfa', '42', 'bravo', '23');
const aHash = await redis.hGetAll('foo');       // { alfa: '42', bravo: '23' }

