'use strict';

let iothub = require('azure-iothub');
let config = require('../config/iothub.js');
let registry = iothub.Registry.fromConnectionString(config.iotHost);

module.exports = {
    /**
     * summary: 
     * description: 
     * parameters: 
     * produces: application/json, text/json
     * responses: 200
     * operationId: device_get
     */
    get: {
        200: function (req, res, callback) {
            registry.list(function (error, list, response) {
                if (!error) {
                    res.json(list);
                } else {
                    res.json(error);
                }
            });
        }
    } 
};