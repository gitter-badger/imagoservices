'use strict';

let dataProvider = require('../../../../data/zone/{latitude}/{longitude}/{radius}.js');

module.exports = {
    get: function zone_getByPosition(req, res, next) {
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