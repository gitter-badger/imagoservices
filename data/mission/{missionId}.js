'use strict';

let iothub = require('azure-iothub');
let config = require('../../config/iothub.js');
let registry = iothub.Registry.fromConnectionString(config.iotHost);
let Client = require('azure-iothub').Client;
let uuid = require('node-uuid');
let connectionString = config.iotHost;

const Database = require('../../lib/Database.js')
const db = new Database();

module.exports = {
    delete: {
        204: function (req, res, callback) {
            try {
                db.deleteMissionEntry(req.params.missionId).then(function (results) {
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
    },
    put: {
        200: function (req, res, callback) {
            try {
                console.log('Updating mission: {}', req.body.name);
                db.updateMissionEntry(req.params.missionId, req.body).then(function (results) {
                    console.log('OK');
                    res.json(req.body);
                    res.status = 200;
                    res.end();
                }, function (error) {
                    console.log(error);
                    res.json(error);
                });
            } catch (exception) {
                res.json(exception);
            }
        }
    }
};
