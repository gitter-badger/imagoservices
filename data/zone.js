'use strict';

let config = require('../config/db.js');
let DocumentDBClient = require('documentdb').DocumentClient;
let uuid = require('node-uuid');
let collectionurl = 'dbs/uavtracking/colls/zones';
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
                queryItems(docDbClient).then(function (results) {
                    res.json(results);
                }, function (error) {
                    res.json(error);
                });
            } catch (exception) {
                res.json(exception);
            }
        }
    },

    post: {
        200: function (req, res, callback) {
            try {
                createEntry(req.body).then(function (item) {
                    res.json(item);
                }, function (error) {
                    console.log('Got error: ' + JSON.stringify(error));
                    res.status(400);
                    res.json(error);
                });
            } catch (exception) {
                console.log(exception);
                res.json(exception);
            }
        }
    }
};

function createEntry(zone) {
    zone.id = uuid.v4();
    let documentUrl = collectionurl + '/docs/' + zone.id;
    return new Promise((resolve, reject) => {
        docDbClient.readDocument(documentUrl, { partitionKey: zone.district }, (err, result) => {
            if (err) {
                if (err.code == 404) {
                    docDbClient.createDocument(collectionurl, zone, (err, created) => {
                        if (err) reject(err)
                        else resolve(created);
                    });
                } else {
                    reject(err);
                }
            } else {
                resolve(result);
            }
        });
    });
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
