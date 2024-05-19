
# Indexing in Redis
- Redis is a key/value database. 
- This means that its data model is `optimized for retrieval by key`
- some queries cant be resolved just by knowing Hash key
    Find all the users who have between 1000 & 3000 checkins
    find full details of person with email `abc@gmail.com`


To resolve the query <which user has the email abc@gmail.com>
- we create a new String key:value
    <emailId as key> ......... userId as value
- If we want to get userDetails, we do this
    get the UserId using <emailId as key>                                       `ncc:users:byemail:abc@gmail.com` is a key
    use hgetall to get full details using userId                                `ncc:users:852` is a key
- as and when stuff changes, we have to change the 

Find all the users who have between 1000 and 3000 checkins
- we use a <Redis Sorted Set> as a secondary index

================================================================= 

Redis search
- a module from redis labs
- secondary index querying engine & query language
- automatically watches over certain <redis hashes>
    and indexes them in a way we define

