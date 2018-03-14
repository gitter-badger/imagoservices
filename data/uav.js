'use strict';

let config = require('../config/db.js');
let DocumentDBClient = require('documentdb').DocumentClient;
let collectionurl = 'dbs/uavtracking/colls/currentpositions';
let docDbClient = new DocumentDBClient(config.host, {
    masterKey: config.authKey
});

/**
 * Operations on /uav
 */
module.exports = {
    get: {
        200: function (req, res, callback) {
            try {
                queryItems().then(function (results) {
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

function queryItems() {
    return new Promise((resolve, reject) => {
        docDbClient.queryDocuments(
            collectionurl,
            'SELECT VALUE r FROM root r'
        ).toArray((err, results) => {
            if (err) reject(err)
            else {
                resolve(results);
            }
        });
    });
};
