// const logger = require('./logger');
// const config = require('@/config').value;
const got = require('got');

const custom = got.extend({
    retry: {
        limit: 2, //config.requestRetry,
        statusCodes: [408, 413, 429, 500, 502, 503, 504, 404], // add 404 to default for unit test
    },
    hooks: {
        // beforeRetry: [
        //     (options, err, count) => {
        //         logger.error(`Request ${err.url} fail, retry attempt #${count}: ${err}`);
        //     },
        // ],
        afterResponse: [
            (response) => {
                try {
                    response.data = JSON.parse(response.body);
                } catch (e) {
                    response.data = response.body;
                }
                response.status = response.statusCode;
                return response;
            },
        ],
        init: [
            (options) => {
                // compatible with axios api
                if (options && options.data) {
                    options.body = options.body || options.data;
                }
            },
        ],
    },
    headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
    },
    timeout: config.requestTimeout,
});
custom.all = (list) => Promise.all(list);

module.exports = custom;
