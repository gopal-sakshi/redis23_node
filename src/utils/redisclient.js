const Redis = require('ioredis');
const logger = require('./logger');
const MAX_SEARCH_RESULTS = 1000;
var config = require('../../config.json');
const redis = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
});


const performSearch = async (index, ...query) => {
    try {
        // Return the first MAX_SEARCH_RESULTS matching documents.
        console.log("searchIp23 ====> ", index, query);
        const searchResults = await redis.call('FT.SEARCH', index, query, 'LIMIT', '0', MAX_SEARCH_RESULTS, console.log);

        if (searchResults.length === 1) {
            return [];          // An empty search result looks like [ 0 ].
        }

        // Actual results look like:
        //
        // [ 3, 'hashKey', ['fieldName', 'fieldValue', ...],
        //      'hashKey', ['fieldName, 'fieldValue', ...], ... ]

        const results = [];
        for (let n = 2; n < searchResults.length; n += 2) {
            const result = {};
            const fieldNamesAndValues = searchResults[n];
            for (let m = 0; m < fieldNamesAndValues.length; m += 2) {
                const k = fieldNamesAndValues[m];
                const v = fieldNamesAndValues[m + 1];
                result[k] = v;
            }
            results.push(result);
        }
        return results;
    } catch (e) {
        logger.error(`Invalid search request for index: ${index}, query: ${query}`);
        logger.error(e);
        return [];      // malformed query
    }
};

module.exports = {
    getClient: () => redis,
    getKeyName: (...args) => `${config.redis.keyPrefix}:${args.join(':')}`,
    performSearch,
};
