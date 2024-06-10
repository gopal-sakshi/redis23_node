-- Redis runs Lua script in a sandbox context, and limits the usage of global variables,

-- https://redis.io/docs/latest/develop/interact/programmability/lua-api/

-- Scripts should never try to access the Redis server's underlying host systems (file system, network, .. )
-- Scripts should operate solely on data stored in Redis and data provided as arguments to their execution.


local function savePlayer(player)
    -- print("player name ", player)
    local file, err = io.open("src/ioredis-examples/run_lua_players23.txt", 'a')        --- append mode
    if file then
        file:write(player)
        file:write('\n')
        file:close()
    else
        -- print("error23 =====> ", err) -- not so hard?
    end
end


local array11 = {"Benz", "Luka", "Kroos", "Marcelo", "CR7" }

for i,v in ipairs(array11) do
    -- print("index23 & value23 =====> ", i, v)
    savePlayer(i..'__'..v)
end