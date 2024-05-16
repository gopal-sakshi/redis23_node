use redis as data store & cache

social network application
- users checkin at different locations & give them star rating
- users, locations, checkins


store checkins for long enough to process them, but not forever.
we use redis stream datatype

When a user posts a new checkin to our API 
- we want to store that data and 
- respond to the user that we've received it as quickly as possible. 

Later we can have one or more other parts of the system do <further processing> with it. 
- updating the total number of checkins
- <last seen at> forum mall -- fields for a user
- calculating a new average star rating for a location.

application is divided into 4 services
- auth service      - listens on http port; password login; redis as shared session store
- checkin receiver  - listens on http port; receives checkin requests from users; each checkin is placed in redis stream
- checkin processor - monitors the checkin stream; update user/location information as it processes each checkin
- api server        - app's endpoints (retrieve info about users/locations from redis)