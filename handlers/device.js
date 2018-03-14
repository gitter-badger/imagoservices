'use strict';

let dataProvider = require('../data/device.js');
/**
 * Operations on /device
 */
module.exports = {
    /**
     * summary: 
     * description: 
     * parameters: 
     * produces: application/json, text/json
     * responses: 200
     */
    get: function device_get(req, res, next) {
        /**
         * Get the data for response 200
         * For response `default` status 200 is used.
         */
        let status = 200;
        let provider = dataProvider['get']['200'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    }
};