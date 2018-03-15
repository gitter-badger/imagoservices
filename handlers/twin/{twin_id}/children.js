'use strict';


let uuid = require('node-uuid');
const Database = require('../../../lib/Database.js')
const db = new Database();

const log = require('../../../lib/LogHelper').getLogger();

module.exports = {
    get: function twin_children_retrieve(req, res, next) {
        log.debug('Retrieving the children of twin with id: ', req.params.twin_id);

        let status = 200;
        db.queryAllTwinChildren(req.params.twin_id).then(function (result) {
            res.json(result);
            res.status(status).send(result);
            next();
        }).catch(function (error) {
            // error
            res.json(error);
            next(error);
        });
    }
}
;
