ioredis_ node-redis_redis

It seems `node-redis` & `redis`
- both are same
- In github repo, its called "node-redis"
- but in npmjs, its just redis.... so, we do `npm i redis`

node-redis
- community-recommended Redis client for Node
- did not have features like
    queue operations
    delayed operations
    retrying on error
    transactions

io-redis
- community-recommended Redis client for Node
- built-in support for Promises

<!----------------------------------------------------------------------------------->

Redis OM
- Redis OM makes it easy to add Redis to your Node application
- Redis OM 
    `maps` <Redis data structures> to simple <JavaScript objects>
- see `redis-om22.js`