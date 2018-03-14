'use strict';

let dataProvider = require('../data/measurement.js');
/**
 * Operations on /uav
 */
module.exports = {

    get: function zone_get(req, res, next) {
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
    delete: function zone_delete(req, res, next) {
        let status = 201;
        let provider = dataProvider['delete']['201'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    }
};
