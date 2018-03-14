'use strict';

const Database = require('../../lib/Database.js')
const db = new Database();

module.exports = {
    delete: {
        204: function (req, res, callback) {
            try {
                db.deleteCommandEntry(req.params.commandstatusId).then(function (results) {
                    res.status = 204;
                    res.end();
                }, function (error) {
                    console.log(error);
                    res.json(error);
                });

            } catch (exception) {
                res.json(exception);
            }
        }
    }, get: {
        200: function (req, res, callback) {
            try {
                db.queryCommandItem(req.params.commandstatusId).then(function (results) {
                    res.json(results);
                }, function (error) {
                    res.json(error);
                });
            } catch (exception) {
                res.json(exception);
            }
        }
    }
};

