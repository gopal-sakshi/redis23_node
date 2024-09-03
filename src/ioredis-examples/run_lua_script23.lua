---@diagnostic disable: undefined-global

local key23 = KEYS[1]
local key24 = KEYS[2]                       --- 1st two arguments are KEYS
local value1 = ARGV[1]            --- 3rd, 4th, 5th arguments ===> values
local value2a = ARGV[2]
local value2b = ARGV[3]
local value2c = ARGV[4]

local r1 = redis.call('hget', key23, 'lastCheckin')         -- key23 ===> ncc:users:499
local r2 = redis.call('hset', key24, 'name', value1, 'manager', value2a, 'stadium', value2b, 'time23a', value2c)

return { r1, r2 }