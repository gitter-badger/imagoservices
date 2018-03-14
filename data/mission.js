'use strict';

let uuid = require('node-uuid');
const Database = require('../lib/Database.js')
const db = new Database();

module.exports = {
    get: {
        200: function (req, res, callback) {
            db.queryMissionEntries().then(function (result) {
                res.json(result);
            }).catch(function (error) {
                // error
                res.json(error);
            });
        }
    },
    post: {
        201: function (req, res, callback) {
            console.log('Saving mission info');
            try {
                let mission = req.body;
                // access db
                db.createMissionEntry(mission).then(function (results) {
                    console.log('Created mission');
                    res.json(
                        mission
                    )
                }, function (error) {
                    console.log('Error creating mission: ', error);
                    res.json(error);
                });;
            } catch (exception) {
                console.log('Exception creating items', exception);
                res.json(exception);
            }
        }
    }
};
