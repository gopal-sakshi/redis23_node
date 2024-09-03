const Redis = require("ioredis");
const redisClient = new Redis();
const fs = require('fs');


const loadLuaScript = async () => {
    redisClient.defineCommand('runLua23', {
        numberOfKeys: 2,
        lua: fs.readFileSync('src/ioredis-examples/run_lua_script23.lua').toString(),
    });
};

const execute23 = async () => {
    console.log("starting lua script23 =====> ");
    await loadLuaScript();
    const time23 = new Date().toISOString();
    let resp23 = await redisClient.runLua23('ncc:users:499', 'lua23_key11', 'realMadrid23', 'Ancelotti', 'Bernabeu', `${time23}`);
    console.log("lua script23 completed =====> ", resp23);
    process.exit();
}
execute23();