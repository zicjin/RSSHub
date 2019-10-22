// const logger = require('./logger');
// const config = require('@/config').value;
const got = require('got');
const queryString = require('query-string');

const custom = got.extend({
    retry: {
        retries: 2,
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
                if (options.data) {
                    options.body = options.body || options.data;
                }
                if (options.responseType === 'buffer') {
                    options.encoding = null;
                }
                if (options.params) {
                    options.query = options.query || queryString.stringify(options.params);
                }
                if (options.query) {
                    options.searchParams = options.query; // for Got v11 after
                }
                if (options.baseUrl) {
                    options.prefixUrl = options.baseUrl; // for Got next version
                }
            },
        ],
    },
    headers: {
        'user-agent': 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
    },
});
custom.all = (list) => Promise.all(list);

module.exports = custom;
