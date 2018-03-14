'use strict';

let config = require('../config/db.js');
let DocumentDBClient = require('documentdb').DocumentClient;
let collectionurl = 'dbs/uavtracking/colls/networkperformance';

let docDbClient = new DocumentDBClient(config.host, {
    masterKey: config.authKey
});


const Database = require('../lib/Database.js')
const db = new Database();

/**
 * Operations on /measurements
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
    delete: {
        201: function (req, res, callback) {
            console.log('delete all entries');

            db.deleteAllMeasurements().then(function (result) {
                res.json({
                    result: 'deleted all measurements'
                })
            }).catch(function (error) {
                console.error('Could not delete all measuremts', error);
                res.json({
                    result: 'Could not delete all measurements'
                })
            });

            /*
            deleteCollection('dbs/uavtracking', 'networkperformance', function (error) {
                if (error) {
                    console.log('Could not delete collection', error);
                } else {
                    console.log('Deleted collection');
                }
                */
            // re-create collection
            /*createCollection('dbs/uavtracking', 'networkperformance', function (error) {
                if (error) {
                    console.log('Could not create collection', error);
                }
                console.log('Re-Created collection');
                res.json({
                    result: 'deleted all measurements'
                })
            });*/
            /* res.json({
                result: 'deleted all measurements'
            })*/
            // });
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

function createCollection(databaseLink, collectionId, callback) {
    //we're creating a Collection here using the default indexingPolicy,
    //for more information on using other indexingPolicies please consult the IndexManagement sample

    //we're also setting the OfferType for this new collection to be an "S1"
    //"S1" is the default, so if a OfferType value is not supplied in the 4th parameter then OfferTyoe of "S1" will apply
    //for more information on OfferTypes please consult the DocumentDB Documentation on
    //http://azure.microsoft.com/en-us/documentation/services/documentdb/

    var collSpec = {
        id: collectionId,
        indexingPolicy: {
            indexingMode: 'consistent',
            automatic: true,
            includedPaths: [
                {
                    path: '/*',
                    indexes: [
                        {
                            kind: 'Range',
                            dataType: 'Number',
                            precision: -1
                        },
                        {
                            kind: 'Range',
                            dataType: 'String',
                            precision: -1
                        },
                        {
                            kind: 'Spatial',
                            dataType: 'Point'
                        }
                    ]
                }
            ],
            excludedPaths: []
        }
    };

    var options = { offerType: "S1" };

    docDbClient.createCollection(databaseLink, collSpec, options, function (err, created) {
        if (err) {
            callback(err);
        } else {
            console.log('Collection \'' + collectionId + '\'created');
            callback(created);
        }
    });
}

function deleteCollection(dbLink, collectionId, callback) {
    console.log('Deleting colleciton', collectionId);
    var collLink = dbLink + '/colls/' + collectionId;
    docDbClient.deleteCollection(collLink, function (err) {
        if (err) {
            console.log('Error deleting collection', err);
            callback(err);
        } else {
            console.log('Collection \'' + collectionId + '\'deleted');
            callback();
        }
    });
}

function deleteIterative(measurements, i) {
    console.log('Deleting entry number: ', i);
    if (i < measurements.length) {
        // delete one entry and call yourself again
        let measurement = measurements[i];
        deleteEntry(measurement.id).then(function (result) {
            i++;
            deleteIterative(measurements, i);
        }).catch(function (error) {
            // error??
            console.log('Error deleting measurement ', error);
        });
    }
}

function deleteEntry(id) {
    console.log('Deleting entry: ', id);
    let documentUrl = collectionurl + '/docs/' + id;
    return new Promise((resolve, reject) => {
        console.log('Deleting measurement ', documentUrl);
        docDbClient.deleteDocument(documentUrl, (err, result) => {
            if (err) {
                console.log('Error deleting measurement ', err);
                reject(err);
            } else {
                console.log('Deleted measurement');
                resolve(result);
            }
        });
    });
};


function deleteAllItems(measurements) {
    for (let measurement in measurements) {
        async(function* () {
            var result = yield deleteEntry(measurement.id);
            console.log('Deleted Measurement', measurement);
        });
        console.log('Deleted entry');
    }
};
