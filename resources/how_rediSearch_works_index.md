https://nimblehq.co/blog/getting-started-with-redisearch


<!-- create some data and add index -->

HMSET product23:101 name "Apple Juice" quantity 22 description "apple eh"
HMSET product23:102 name "Mango Juice" quantity 34 description "maamidikaaya"
HMSET product23:103 name "Grape Smoothie" quantity 15 description "juice laa unde"
HMSET product23:104 name "Avacado" quantity 24 description "butterfruit ani kooda antaaru"
HMSET product23:105 name "Blueberry" quantity 16 description "nelam berry anta"
HMSET product23:106 name "Orage" quantity 56 description "kamala pandu"
HMSET product23:107 name "Mushroom" quantity 78 description "puttagodugu"
HMSET product23:108 name "Neem" quantity 56 description "vepaaku"
HMSET product23:109 name "Lemon" quantity 99 description "nimmakaaya"
HMSET product23:110 name "Muskmelon" quantity 19 description "puchhakaaya type"
HMSET product23:111 name "carrot" quantity 10 description "carrot eh"
HMSET product23:112 name "brinjal" quantity 56 description "vankaaya"
HMSET product23:113 name "Pineapple" quantity 78 description "pineapple eh"
HMSET product23:114 name "Papaya" quantity 92 description "boppasakaya"
HMSET product23:115 name "bitter gourd" quantity 11 description "kakarakaaya"
HMSET product23:115 name "apple fruit" quantity 44 description "seema regu pandu"

FT.CREATE productsIdx23 ON HASH PREFIX 1 product23: SCHEMA name TEXT SORTABLE quantity NUMERIC SORTABLE description TEXT
--- indexing is based on the prefix specified; 
--- all <Redis hash keys> which start with prefix product23: will be added to this index.
--- we have 15 such hash keys
--- this productsIdx23 covers three fields
    <name TEXT SORTABLE> 
    <quantity NUMERIC SORTABLE> 
    <description TEXT>

FT.SEARCH productsIdx23 app*                    // start with app*       -- 
FT.SEARCH productsIdx23 *app*                   // must contain 'app'    -- Pineapple valid result
FT.SEARCH productsIdx23 jui*                    // Returns product with the name Apple Juice, Mango Juice
FT.SEARCH productsIdx23 "@name:app*"               // For searching across a specific field; not working
FT.SEARCH productsIdx23 "@quantity:[50 75]"     // quantity not more than 75 & above 50
FT.SEARCH productsIdx23 "@quantity:[50 75]" SORTBY quantity DESC
FT.SEARCH productsIdx23 *app* WITHSORTKEYS
FT.SEARCH productsIdx23 *app* SORTBY quantity ASC
FT.SEARCH productsIdx23 "*" RETURN 2 __key, description     ????????

FT.SEARCH ncc:usersidx "@email:anita*" RETURN 1 password
FT.SEARCH ncc:usersidx "@firstName:Anita*" RETURN 1 password

FT.SEARCH ncc:usersidx "@firstName:A*"              // NOT WORKING      
FT.SEARCH ncc:usersidx "@firstName:Anita*"          // WORKING

----- fuzzy search
FT.SEARCH products %jui%            // Search with fields with L.D upto 1
FT.SEARCH products %%jui%%          // Search with fields with L.D upto 2
FT.SEARCH products %%%jui%%%        // Search with fields with L.D upto 3
<!-- create some data and add index -->

FT.CREATE ncc:usersidx ON HASH PREFIX 1 ncc:users: SCHEMA email TAG numCheckins NUMERIC SORTABLE lastSeenAt NUMERIC SORTABLE lastCheckin NUMERIC SORTABLE firstName TEXT lastName TEXT
    <email TAG> 
    <numCheckins NUMERIC SORTABLE> 
    <lastSeenAt NUMERIC SORTABLE> 
    <lastCheckin NUMERIC SORTABLE> 
    <firstName TEXT> 
    <lastName TEXT>

FT.INFO productsIdx23
FT._LIST

<!------------------------------------------------------------------------------------------->
`Selection`
SELECT * FROM bicycles WHERE price >= 1000	
FT.SEARCH idx:bicycle "@price:[1000 +inf]"

`Simple projection`
SELECT id, price FROM bicycles
FT.SEARCH idx:bicycle "*" RETURN 2 __key, price

`Calculated projection`
SELECT id, price-price*0.1 AS discounted23 FROM bicycles
FT.AGGREGATE idx:bicycle "*" LOAD 2 __key price APPLY "@price-@price*0.1" AS discounted23

`Aggregation`
SELECT condition, AVG(price) AS avg_price FROM bicycles GROUP BY condition
FT.AGGREGATE idx:bicycle "*" GROUPBY 1 @condition REDUCE AVG 1 @price AS avg_price

<!------------------------------------------------------------------------------------------->