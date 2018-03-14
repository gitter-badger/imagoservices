'use strict';

let dataProvider = require('../../data/mission/{missionId}.js');

module.exports = {
    delete: function mission_delete(req, res, next) {
        let status = 204;
        let provider = dataProvider['delete']['204'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    }, put: function mission_update(req, res, next) {
        console.log('Updating mission in handler');
        let status = 200;
        let provider = dataProvider['put']['200'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    }
};
