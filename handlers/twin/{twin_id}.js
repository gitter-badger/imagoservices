'use strict';


let uuid = require('node-uuid');
const Database = require('../../lib/Database.js')
const db = new Database();

const log = require('../../lib/LogHelper').getLogger();

module.exports = {
    delete: function twin_delete(req, res, next) {
        log.debug('Deleting the twin with id: ' , req.params.twin_id);
        let status = 204;
        db.deleteTwin(req.params.twin_id).then(function (result) {
            res.json(result);
            res.status(status).send(result);
            next();
        }).catch(function (error) {
            // error
            res.json(error);
            next(error);
        });
    }, put: function twin_put(req, res, next) {
        log.debug('Updating the twin with id: ' , req.params.twin_id);
        let status = 200;
        db.updateTwin(req.params.twin_id, req.body).then(function (result) {
            res.status(status).send(result);
        }).catch(function (error) {
            // error
            res.status(500).send(error);
        });
    }
};
 