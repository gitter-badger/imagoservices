'use strict';

let dataProvider = require('../../data/command/{deviceId}.js');

module.exports = {
    post: function command_post(req, res, next) {
        let status = 200;
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