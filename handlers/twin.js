'use strict';


let uuid = require('node-uuid');
const Database = require('../lib/Database.js')
const db = new Database();

const log = require('../lib/LogHelper').getLogger();


module.exports = {
    get: function twin_getAll(req, res, next) {
        log.debug('This is the get twin call');
        let status = 200;
        db.queryAllTwins().then(function (result) {
            res.status(status).send(result);
        }).catch(function (error) {
            res.status(500).send(error);
        });
    }, post: function twin_post(req, res, next) {
        let status = 200;
        db.createTwin(req.body).then(function(result){
            res.status(status).send(result);
        }).catch(function(err){
            res.status(500).send(err);
        });
    }
};
 