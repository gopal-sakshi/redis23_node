<!-- dataTypes1.md & dataTypes2.md ===> is in learnings folder also -->

Redis supports 6 data types. 
For each data type, the command to retrieve it is different.


Redis keys =======> strings
Redis values =====> strings/arrays/objects


if value is of type string ->           GET <key>
if value is of type hash ->             HGET or HMGET or HGETALL <key>
if value is of type lists ->            lrange <key> <start> <end>
if value is of type sets ->             smembers <key>
if value is of type sorted sets ->      ZRANGEBYSCORE <key> <min> <max>
if value is of type stream ->           xread count <count> streams <key> <ID>


Use the TYPE command to check the type of value a key is mapping to:
type <key>

======================================================================

string
hash            store JS objects
lists           linked lists
sets            unique keys (unordered)
sorted sets     unique keys (but ordered)
stream          
======================================================================