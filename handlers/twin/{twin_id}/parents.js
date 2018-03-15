'use strict';


let uuid = require('node-uuid');
const Database = require('../../../lib/Database.js')
const db = new Database();

const log = require('../../../lib/LogHelper').getLogger();

module.exports = {
    get: function twin_parent_retrieve(req, res, next) {
        log.debug('Retrieving the parents of twin with id: ', req.params.twin_id);
        let status = 200;
        db.queryAllTwinParents(req.params.twin_id).then(function (result) {
            res.status(status).send(result);
        }).catch(function (error) {
            // error
            res.status(500).send(error);
        });
    }
}
;