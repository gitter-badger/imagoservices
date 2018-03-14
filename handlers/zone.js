'use strict';

let dataProvider = require('../data/zone.js');
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
    post: function zone_post(req, res, next) {
        let status = 200;
        let provider = dataProvider['post']['200'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    }
};
