'use strict';

let dataProvider = require('../../../../../data/measurement/altituderange/{latitude}/{longitude}/{radius}.js');
/**
 * Operations on /measurement/{latitude}/{longitude}/{radius}
 */
module.exports = {
    /**
     * summary:
     * description:
     * parameters: latitude, longitude, radius
     * produces: application/json, text/json
     * responses: 200
     */
    get: function measurement_getRangesByPosition(req, res, next) {
        console.log('GET neasurements by position');
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
