'use strict';

let dataProvider = require('../../../data/uav/{deviceId}/mission.js');

module.exports = {

    post: function mission_post(req, res, next) {
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
