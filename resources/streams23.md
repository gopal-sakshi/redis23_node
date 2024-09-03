XREADGROUP GROUP checkinConsumers BLOCK 2000 COUNT 10 STREAMS ncc:checkins >
????

<!-------------------------------------------------------------------------->

originally there are 5000 entries in STREAM === <ncc:checkins>
POST 8 times === http://localhost:3067/api/checkin === from postman
now, there will be 5008 entries in the stream <ncc:checkins> 

npm run checkingroupprocessor consumer11