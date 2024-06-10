
<!-- dataTypes1.md & dataTypes2.md ===> is in learnings folder also -->

`Keys`
- you can use any binary sequence as a key
- The maximum allowed key size is 512 MB
- A value can't be bigger than 512 MB

set key12 jingChak12
get key12
set key12 newJingChak nx
    nx ===> SET fails if the key already exists
---------------------------------------------------------------------------------

set counter23 100
incr counter23
incrby counter23 50

`INCR, INCRBY, DECR, DECRBY`
- they are atomic
- even if multiple clients issue INCR against the same key
    they will never enter into a race condition.
    it will never happen that client 1 reads "10", client 2 reads "10" at the same time
    the final value will always be 12
# ---------------------------------------------------------------------------------

`mset & mget`

mset a 10 b 20 c 30
mget a b c

exists key12
del key12
type key12

expire key12 5                      // expires after 5 seconds
set key13 "jingChak13" ex 10        // expires after 10 seconds
ttl key13                           // time to live
-----------------------------------------------------------------------------

`Lists`
- Redis lists are implemented via <Linked Lists>
- adding element @ start/end/middle
    redis lists             constant time... even if number of elements are 10 (or) 92 million
    array                   time-taking
- accessing element by index 
    redis lists             time is proportional to the index of the accessed element
    array                   constant time


LPUSH
RPUSH
LRANGE
RPOP

<LRANGE 0 9>                // to get the latest 10 posted items.
<LTRIM list23 0 3>          // retain only first 4 elements... discard the rest
<BRPOP & BLPOP>             // block if the list is empty: 
                                // they'll return to the caller only when a new element is added to the list

# ---------------------------------------------------------------------------------------------

`Hashes`
- record types structured as collections of field-value pairs
- <HSET user123 username martina firstName Martina lastName Elisa country GB>
    this command is similar to saving a javascript object in Redis
        const user123 = {
            username: martina,
            firstName: Martina,
            lastName: Elisa,
            country: GB
        }
    HGET user123 username                   // martina
    HGET user123 lastName                   // Elisa
    HMGET user123 lastName country          // Elisa GB
- Other commands
    hset, hget, hgetall, hmget, hincrby
- Redis doesn't support nested data structures
    use RedisJSON (a Redis module that provides JSON capabilities)
# ---------------------------------------------------------------------------------------------

`sets`
- unordered collection of unique strings
- add items to `user124Fav` collection
    <sadd user124Fav theAudacityOfHope>
    <sadd user124Fav EnglishAugust>
    <sadd user124Fav IndiaAfterGandhi>
- Other commands
    sadd, smembers, sismember

`lists_vs_sets`
- lists & sets        = both are collection of stringElements
- Differences
    sets = unique, doesnt allow duplicity, doesnt preserve order
    lists = can have duplicates... sorted/ordered according to order_of_insertion
- LIST is most efficient than SET when working with the edges (L/R PUSH/POP)
- Checking if an element exists is very efficient in SET/ZSET

# --------------------------------------------------------------------------------------------

`Sorted Sets`
- collection of unique strings (ordered)
- some commands
    ZADD leaderboard23 100 user1
    ZADD leaderboard23 90 user2
    ZADD leaderboard23 101 user3
    ZADD leaderboard23 72 user2
    ZADD leaderboard23 89 user4
    ZADD leaderboard23 110 user3
    ZADD leaderboard23 100 user5
    ZADD leaderboard23 90 user6
    ZADD leaderboard23 180 user7
    ZADD leaderboard23 70 user6
    ZADD leaderboard23 120 user2
    ZADD leaderboard23 130 user7
    ZADD leaderboard23 90 user8
- Other commands
    ZRANGE leaderboard23 0 4 REV WITHSCORES
    ZRANGE leaderboard23 0 4 REV
    ZRANGE leaderboard23 0 4 WITHSCORES
    ZRANGE leaderboard23 (90 120 BYSCORE                                return all elements with 90 < score <= 120
    ZRANGE leaderboard23 (90 (120 BYSCORE                               return all elements with 90 < score < 120
    ZRANGE leaderboard23 90 120 BYSCORE WITHSCORES
    ZREVRANK leaderboard23 user3
    ZRANK leaderboard23 user2                       // find the rank of user2
# --------------------------------------------------------------------------------------------

`Streams`
- a data structure that acts like an append-only log
- track userActions (clicks), sensor monitoring, etc
- Some commands
    XADD weather23:Chennai:27Mar * temp_f 87.2 pressure 29.69 humidity 46
    XADD weather23:Chennai:27Mar * temp_f 88.2 pressure 30.69 humidity 41
    XADD weather23:Chennai:27Mar * temp_f 82.5 pressure 29.54 humidity 48
    XADD weather23:Chennai:27Mar * temp_f 87.5 pressure 29.23 humidity 42
    XADD weather23:Chennai:27Mar * temp_f 81.9 pressure 30.77 humidity 43
    XADD weather23:Chennai:27Mar * temp_f 86.4 pressure 30.34 humidity 45
- other commands
    XRANGE weather23:Chennai:27Mar 1679858503935-0 + COUNT 2
            // read 2 streams
            // 1679858503935-0 ====> the id that is generated for eachStream
    XREAD COUNT 100 BLOCK 300 STREAMS weather23:Chennai:27Mar $         
            // read upcoming streams 100 entries in stream... block for 300ms
    XLEN weather23:Chennai:27Mar
            // length of stream
- cappedStreams = keep the stream size in check; use MAXLEN commandLineArg
- https://redis.io/commands/xadd/


    