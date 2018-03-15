'use strict';

let uuid = require('node-uuid');
const Database = require('../../../../lib/Database.js')
const db = new Database();

const log = require('../../../../lib/LogHelper').getLogger();


module.exports = {
    get: function twin_getInRange(req, res, next) {
        log.debug('This is the get twin call for area');
        let status = 200;
        // TODO: Do i need to validate or use defaults?
        db.queryTwinsInRange(req.params.latitude, req.params.longitude, req.params.radius).then(function (result) {
            res.status(status).send(result);
        }).catch(function (error) {
            // error
            res.status(500).send(error);
        });
    }
};
 