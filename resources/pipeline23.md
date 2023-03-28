`Pipelining`
- A Request/Response server can be implemented so that 
    it is able to process new requests even if the client hasn't already read the old responses. 
- This way it is possible to send multiple commands to the server 
    without waiting for the replies at all
    and finally read the replies in a single step.
- While the client sends commands using pipelining, the server will be forced to queue the replies, using memory. 
- So if you need to send a lot of commands with pipelining, it is better to send them as batches
    for instance 10k commands, read the replies,
    and then send another 10k commands again, 
    and so forth.

(printf "PING\r\nPING\r\nPING\r\n"; sleep 1) | nc localhost 6379
- nc is netcat (read/write from network connections)


`Scripting`
- use Lua scripts
- a number of use cases for pipelining can be addressed more efficiently using scripts