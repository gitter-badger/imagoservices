'use strict';

let config = require('../../../../config/db.js');
let DocumentDBClient = require('documentdb').DocumentClient;
let docDbClient = new DocumentDBClient(config.host, {
    masterKey: config.authKey
});

module.exports = {
    get: {
        200: function (req, res, callback) {
            try {
                queryUavsInRange(req.params.latitude, req.params.longitude, req.params.radius).then(function (results) {
                    // got the uavs now format array and fetch the commandstatusses
                    let deviceIds = "'" + results.join("','") + "'";
                    queryCommandStatusForDevices(deviceIds).then(function (statusses) {
                        res.json(statusses);
                    }, function (error) {
                        res.status(400);
                        res.json(error);
                    });
                }, function (error) {
                    console.log("Got error " + JSON.stringify(error));
                    res.status(400);
                    res.json(error);
                });
            }
            catch (exception) {
                res.status(500);
                res.json(exception);
            }
        }
    }
};

function queryCommandStatusForDevices(deviceIds) {
    let timestamp = Math.ceil((Date.now() / 1000) - (60 * 60 * 24));
    let query = "SELECT VALUE r FROM root r WHERE r._ts > " + timestamp + " AND r.deviceId IN (" + deviceIds + ") ORDER BY r._ts desc";
    return new Promise((resolve, reject) => {
        docDbClient.queryDocuments('dbs/uavtracking/colls/commandstatus', query).toArray((err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results);
            }
        });
    });
};

function queryUavsInRange(lat, lon, range) {
    let query = 'SELECT r.deviceId FROM root r WHERE ST_DISTANCE(r.location, {"type":"Point", "coordinates":[' + lon + ' , ' + lat + ']}) < ' + range;
    return new Promise((resolve, reject) => {
        docDbClient.queryDocuments('dbs/uavtracking/colls/currentpositions', query).toArray((err, results) => {
            if (err) reject(err)
            else {
                let devices = [];
                for (let i = 0; i < results.length; i++) {
                    devices.push(results[i].deviceId);
                }
                resolve(devices);
            }
        });
    });
};