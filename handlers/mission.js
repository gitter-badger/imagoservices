'use strict';

let dataProvider = require('../data/mission.js');

module.exports = {
    get: function mission_get(req, res, next) {
        let status = 200;
        let provider = dataProvider['get']['200'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    }, post: function mission_post(req, res, next) {
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
