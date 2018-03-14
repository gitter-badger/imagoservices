'use strict';

let dataProvider = require('../data/message.js');
/**
 * Operations on /uav
 */
module.exports = {
    post: function message_post(req, res, next) {
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
