'use strict';

let Swagmock = require('swagmock');
let Path = require('path');
let apiPath = Path.resolve(__dirname, '../config/swagger.json');
let mockgen;

module.exports = function () {
    /**
     * Cached mock generator
     */
    mockgen = mockgen || Swagmock(apiPath);
    return mockgen;
};
