'use strict';

let dataProvider = require('../../../../../../data/measurement/{latitude}/{longitude}/{radius}/{minalt}/{maxalt}.js');

module.exports = {
    /**
     * summary:
     * description:
     * parameters: latitude, longitude, radius, minalt, maxalt
     * produces: application/json, text/json
     * responses: 200
     */
    get: function measurement_getByPositionAndAltitude(req, res, next) {
        console.log('GET neasurements by position and altitude');
        let status = 200;
        let provider = dataProvider['get']['200'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    },
    post: function measurement_generateForPositionAndAltitude(req, res, next) {
        /**
         * Generate a load of entries for testing
         */
        console.log('POST neasurements for position and altitude');
        let status = 201;
        let provider = dataProvider['post']['201'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    }
};
