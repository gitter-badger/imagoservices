'use strict';


let uuid = require('node-uuid');
const Database = require('../lib/Database.js')
const db = new Database();

module.exports = {
    get: function twin_get(req, res, next) {
        let status = 200;
        db.queryMissionEntries().then(function (result) {
            res.json(result);
            res.status(status).send(result);
            next();
        }).catch(function (error) {
            // error
            res.json(error);
            next(error);
        });
    }, post: function mission_post(req, res, next) {
        let status = 201;
    }
};
 