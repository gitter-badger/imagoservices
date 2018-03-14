'use strict';

let dataProvider = require('../../data/device/{deviceId}.js');
/**
 * Operations on /device/{deviceId}
 */
module.exports = {
    /**
     * summary:
     * description:
     * parameters: deviceId
     * produces: application/json, text/json
     * responses: 201, 400, 409
     */
    put: function device_registerDevice(req, res, next) {
        /**
         * Get the data for response 200
         * For response `default` status 200 is used.
         */
        let status = 200;
        let provider = dataProvider['put']['200'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    },
    delete: function device_deleteDevice(req, res, next) {
        let status = 204;
        let provider = dataProvider['delete']['204'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    },
    get: function device_getDeviceById(req, res, next) {
        let status = 200;
        let provider = dataProvider['get']['200'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                res.status(404).send(data && data.responses);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    }

};
