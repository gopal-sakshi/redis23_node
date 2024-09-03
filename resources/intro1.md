`main vs main_copy branch`
- main_copy branch is a copy of main branch... it uses all these things that are not needed for me right now
    redis runs in docker
    better-config
    CRASH_COURSE_CONFIG_FILE
- so, light-weight code is in <main> branch

----------------------------------------------------------
https://developer.redis.com/develop/node/nodecrashcourse/runningtheapplication/


npm run start                               listens on port 3063
npm run load all                            load the sampleData into Redis
hgetall ncc:locations:106
hgetall ncc:users:12                        verify data is loaded
json.get ncc:locationdetails:121
----------------------------------------------------------