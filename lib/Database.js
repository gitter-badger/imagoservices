'use strict';

let config = require('../config/db.js');
const DocumentDBClient = require('documentdb').DocumentClient;
const measurementcollectionurl = 'dbs/uavtracking/colls/networkperformance';
const commandstatuscollectionurl = 'dbs/uavtracking/colls/commandstatus';
const zonescollectionurl = 'dbs/uavtracking/colls/zones';
const uavcollectionurl = 'dbs/uavtracking/colls/currentpositions';
const groupscollectionurl = 'dbs/uavtracking/colls/measurementgroups';
const plannedmissionscollectionurl = 'dbs/uavtracking/colls/plannedmissions';

const twincollectionurl = 'dbs/twins/colls/twins';

const uuid = require('node-uuid');

const docDbClient = new DocumentDBClient(config.host, {
    masterKey: config.authKey
});

const Database = function () {
    const self = this;

    // Measurements
    self.queryMeasurementItemsInRange = function (lat, lon, radius, minalt, maxalt) {
        let query = 'SELECT * FROM root r WHERE ST_DISTANCE(r.location, {"type":"Point", "coordinates":[' + lon + ' , ' + lat + ']}) < ' + radius + ' AND r.location.alt >= ' + minalt + ' AND r.location.alt <= ' + maxalt;
        console.log('Query ', query);
        return new Promise((resolve, reject) => {
            console.log('Querying ...');
            docDbClient.queryDocuments(
                measurementcollectionurl,
                query
            ).toArray((err, results) => {
                if (err) {
                    reject(err)
                } else {
                    console.log('Successfully fetched s', results.length, ' items');
                    resolve(results);
                }
            });
        });
    };

    self.deleteAllMeasurements = function () {
        return new Promise((resolve, reject) => {
            self.queryAllMeasurements().then(function (results) {
                const deleteArray = [];
                for (let i = 0; i < results.length; i++) {
                    deleteArray.push(self.deleteMeasurementItem(results[i]));
                }
                Promise.all(deleteArray).then(function (result) {
                    console.info('Done deleting all measurements');
                    resolve(result);
                }).catch(function (error) {
                    reject(error);
                });
            }).catch(function (error) {
                console.error('Could not fetch all measurements');
            });
        });
    };
    // Missions
    self.queryMissionEntries = function () {
        // let query = 'SELECT * FROM root r WHERE ST_DISTANCE(r.location, {"type":"Point", "coordinates":[' + lon + ' , ' + lat + ']}) < ' + radius + ' AND r.location.alt >= ' + minalt + ' AND r.location.alt <= ' + maxalt;
        let query = 'SELECT * FROM root r';
        console.log('Query ', query);
        return new Promise((resolve, reject) => {
            console.log('Querying ...');
            docDbClient.queryDocuments(
                plannedmissionscollectionurl,
                query
            ).toArray((err, results) => {
                if (err) {
                    reject(err)
                } else {
                    console.log('Successfully fetched s', results.length, ' items');
                    resolve(results);
                }
            });
        });
    };

    self.updateMissionEntry = function (missionId, mission) {
        return new Promise((resolve, reject) => {
            let documentUrl = plannedmissionscollectionurl + '/docs/' + missionId;
            console.log('Updating in DB');
            docDbClient.replaceDocument(documentUrl, mission, function (err, updated) {
                if (err) {
                    console.log('Error in DB: {}', err);
                    reject(err);
                } else {
                    console.log('OK');
                    resolve(mission);
                }
            });
        });
    };

    /*
        stores the given twin in the database
    */
    self.createTwin = function (twin) {
        twin.id = uuid.v4();
        let documentUrl = twincollectionurl + '/docs/' + twin.id;
        return new Promise((resolve, reject) => {
            docDbClient.readDocument(documentUrl, (err, result) => {
                if (err) {
                    if (err.code == 404) {
                        docDbClient.createDocument(twincollectionurl, twin, (err, created) => {
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
    }

    self.updateTwin = function (twinId, twin) {
        return new Promise((resolve, reject) => {
            let documentUrl = twincollectionurl + '/docs/' + twinId;
            console.log('Updating twin in DB');
            docDbClient.replaceDocument(documentUrl, twin, function (err, updated) {
                if (err) {
                    console.log('Error in DB: {}', err);
                    reject(err);
                } else {
                    console.log('OK');
                    resolve(twin);
                }
            });
        });
    };

    self.retrieveTwin = function (twinId) {
        let query = 'SELECT value t FROM t where t.id = "' + twinId + '"';

        return new Promise((resolve, reject) => {
            docDbClient.queryDocuments(
                twincollectionurl,
                query
            ).toArray((err, results) => {
                if (err) reject(err)
                else {
                    resolve(results);
                }
            });
        });
    };


    self.deleteTwin = function (id) {
        let documentUrl = twincollectionurl + '/docs/' + id;
        return new Promise((resolve, reject) => {
            docDbClient.deleteDocument(documentUrl, (err, result) => {
                if (err) reject(err);
                else {
                    resolve(result);
                }
            });
        });
    };

    self.queryAllTwins = function (lat, lon, radius) {
        let query = 'SELECT VALUE r FROM root r';
        return new Promise((resolve, reject) => {
            docDbClient.queryDocuments(
                twincollectionurl,
                query
            ).toArray((err, results) => {
                if (err) reject(err)
                else {
                    resolve(results);
                }
            });
        });
    };

    self.queryAllTwinChildrenIds = function (twinId) {
        let query = 'SELECT VALUE t.subTwins FROM root t where t.id = "' + twinId + '"';

        return new Promise((resolve, reject) => {
            docDbClient.queryDocuments(
                twincollectionurl,
                query
            ).toArray((err, results) => {

                if (err) {
                    console.log('Error while retrieving subtwin ids from DB ' + err);
                    reject(err)
                }
                else {
                    console.log('Returning subtwin id result from DB "' + results + '"');
                    resolve(results);
                }
            });
        });
    };

    self.queryAllTwinChildren = function (twinId) {
        return this.queryAllTwinChildrenIds(twinId).then(function (result) {

            if (result.length == 0) {
                return []
            }

            let twinIds = '';
            for (var id in result[0]) {
                twinIds = twinIds + '"' + result[0][id].toString() + '",'
            }

            let query = 'SELECT * from t2 where t2.id in ( ' + twinIds.substring(0, twinIds.length - 1) + ')';

            console.log('Retrieving twins for ids from DB with query:\n' + query);

            return new Promise((resolve, reject) => {
                docDbClient.queryDocuments(
                    twincollectionurl,
                    query
                ).toArray((err, results) => {
                    if (err) {
                        console.log('Error while retrieving subtwins from DB ' + err);
                        reject(err)
                    }
                    else {
                        console.log('Returning subtwin result from DB ' + results);
                        resolve(results);
                    }
                })
            });
        })
    };

    self.queryAllTwinParentIds = function (twinId) {
        let query = 'SELECT twins.id FROM twins where ARRAY_CONTAINS(twins.subTwins,  "'+ twinId + '" , true)';

        return new Promise((resolve, reject) => {
            docDbClient.queryDocuments(
                twincollectionurl,
                query
            ).toArray((err, results) => {

                if (err) {
                    console.log('Error while retrieving subtwin ids from DB ' + err);
                    reject(err)
                }
                else {
                    console.log('Returning subtwin id result from DB "' + results + '"');
                    resolve(results);
                }
            });
        });
    };

    self.queryAllTwinParents = function (twinId) {
        return this.queryAllTwinParentIds(twinId).then(function (result) {

            if (result.length == 0) {
                return []
            }

            let twinIds = '';
            for (var id in result[0]) {
                twinIds = twinIds + '"' + result[0][id].toString() + '",'
            }

            let query = 'SELECT * from t where t.id in ( ' + twinIds.substring(0, twinIds.length - 1) + ')';

            console.log('Retrieving twins for ids from DB with query:\n' + query);

            return new Promise((resolve, reject) => {
                docDbClient.queryDocuments(
                    twincollectionurl,
                    query
                ).toArray((err, results) => {
                    if (err) {
                        console.log('Error while retrieving subtwins from DB ' + err);
                        reject(err)
                    }
                    else {
                        console.log('Returning subtwin result from DB ' + results);
                        resolve(results);
                    }
                })
            });
        })
    };

    self.queryTwinsInRange = function (lat, lon, radius) {
        let query = 'SELECT VALUE r FROM root r WHERE ST_DISTANCE(r.location, {"type":"Point", "coordinates":[' + lon +
            ' , ' + lat + ']}) < ' + radius;
        // let query = 'SELECT VALUE r FROM root r';
        return new Promise((resolve, reject) => {
            docDbClient.queryDocuments(
                twincollectionurl,
                query
            ).toArray((err, results) => {
                if (err) reject(err)
                else {
                    resolve(results);
                }
            });
        });
    };

    self.createMissionEntry = function (mission) {
        mission.id = uuid.v4();
        let documentUrl = plannedmissionscollectionurl + '/docs/' + mission.id;
        return new Promise((resolve, reject) => {
            docDbClient.readDocument(documentUrl, (err, result) => {
                if (err) {
                    if (err.code == 404) {
                        docDbClient.createDocument(plannedmissionscollectionurl, mission, (err, created) => {
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

    self.deleteMissionEntry = function (missionEntryId) {
        let documentUrl = plannedmissionscollectionurl + '/docs/' + missionEntryId;
        return new Promise((resolve, reject) => {
            docDbClient.deleteDocument(documentUrl, (err, result) => {
                if (err) reject(err);
                else {
                    resolve(result);
                }
            });
        });
    };
    self.createMeasurementEntry = function (measurement) {
        measurement.id = uuid.v4();
        let documentUrl = measurementcollectionurl + '/docs/' + measurement.id;
        return new Promise((resolve, reject) => {
            docDbClient.readDocument(documentUrl, (err, result) => {
                if (err) {
                    if (err.code == 404) {
                        docDbClient.createDocument(measurementcollectionurl, measurement, (err, created) => {
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

    self.queryGroupsInRange = function (lat, lon, radius) {
        let query = 'SELECT r.groupid AS groupid FROM root r WHERE ST_DISTANCE(r.location, {"type":"Point", "coordinates":[' + lon + ' , ' + lat + ']}) < ' + radius;
        console.log('Query ', query);
        return new Promise((resolve, reject) => {
            console.log('Querying ...');
            docDbClient.queryDocuments(
                groupscollectionurl,
                query
            ).toArray((err, results) => {
                if (err) {
                    reject(err)
                } else {
                    console.log('Successfully fetched ', results.length, ' items');
                    resolve(results);
                }
            });
        });
    };

    self.queryAllMeasurements = function () {
        let query = 'SELECT * FROM root r';
        return new Promise((resolve, reject) => {
            console.log('Querying ...');
            docDbClient.queryDocuments(
                measurementcollectionurl,
                query
            ).toArray((err, results) => {
                if (err) {
                    reject(err)
                } else {
                    console.log('Successfully fetched ', results.length, ' items');
                    resolve(results);
                }
            });
        });
    }

    self.queryMeasurementRangesInRange = function (lat, lon, radius) {
        let query = 'SELECT MAX(r.location.alt) AS max, MIN(r.location.alt) AS min FROM root r WHERE ST_DISTANCE(r.location, {"type":"Point", "coordinates":[' + lon + ' , ' + lat + ']}) < ' + radius;
        console.log('Query ', query);
        return new Promise((resolve, reject) => {
            console.log('Querying ...');
            docDbClient.queryDocuments(
                measurementcollectionurl,
                query
            ).toArray((err, results) => {
                if (err) {
                    reject(err)
                } else {
                    console.log('Successfully fetched ', results.length, ' items');
                    resolve(results);
                }
            });
        });
    };


    self.deleteMeasurementItem = function (measurementItem) {
        let documentUrl = measurementcollectionurl + '/docs/' + measurementItem.id;
        return new Promise((resolve, reject) => {
            docDbClient.deleteDocument(documentUrl, (err, result) => {
                if (err) reject(err);
                else {
                    resolve(result);
                }
            });
        });
    };

    // Commands
    self.deleteCommandEntry = function (commandstatusId) {
        let documentUrl = commandstatuscollectionurl + '/docs/' + commandstatusId;
        return new Promise((resolve, reject) => {
            docDbClient.deleteDocument(documentUrl, (err, result) => {
                if (err) reject(err);
                else {
                    resolve(result);
                }
            });
        });
    };

    self.queryCommandItem = function (commandstatusId) {
        return new Promise((resolve, reject) => {
            docDbClient.queryDocuments(
                commandstatuscollectionurl, 'SELECT VALUE r FROM root r WHERE r.id=\'' + commandstatusId + '\''
            ).toArray((err, results) => {
                if (err) reject(err)
                else {
                    resolve(results);
                }
            });
        });
    };

    // UAVs
    self.queryUAVsInRange = function (lat, lon, radius, filter) {
        let query = 'SELECT VALUE r FROM root r WHERE ST_DISTANCE(r.location, {"type":"Point", "coordinates":[' + lon +
            ' , ' + lat + ']}) < ' + radius;
        if (filter) {
            let flyingVal = filter === 'flying' ? '1' : '0';
            let query = 'SELECT VALUE r FROM root r WHERE r.isFlying = ' + flyingVal +
                ' AND ST_DISTANCE(r.location, {"type":"Point", "coordinates":[' + lon + ' , ' + lat + ']}) < ' + radius;
        }
        try {
            return new Promise((resolve, reject) => {
                docDbClient.queryDocuments(
                    uavcollectionurl,
                    query
                ).toArray((err, results) => {
                    if (err) reject(err)
                    else {
                        resolve(results);
                    }
                });
            });
        } catch (Exception) {
            // error
        }
    };

    self.deleteZoneEntry = function (zoneId) {
        let documentUrl = zonescollectionurl + '/docs/' + zoneId;
        return new Promise((resolve, reject) => {
            docDbClient.deleteDocument(documentUrl, (err, result) => {
                if (err) reject(err);
                else {
                    resolve(result);
                }
            });
        });
    };

    self.queryZoneItem = function (zoneId) {
        return new Promise((resolve, reject) => {
            docDbClient.queryDocuments(
                zonescollectionurl, 'SELECT VALUE r FROM root r WHERE r.id=\'' + zoneId + '\''
            ).toArray((err, results) => {
                if (err) reject(err)
                else {
                    resolve(results);
                }
            });
        });
    };

    self.queryZoneItemsInRange = function (lat, lon, radius) {
        //    let query = 'SELECT VALUE r FROM root r WHERE ST_DISTANCE(r.location, {"type":"Point", "coordinates":[' + lon +
        //      ' , ' + lat + ']}) < ' + radius;
        let query = 'SELECT VALUE r FROM root r';
        return new Promise((resolve, reject) => {
            docDbClient.queryDocuments(
                zonescollectionurl,
                query
            ).toArray((err, results) => {
                if (err) reject(err)
                else {
                    resolve(results);
                }
            });
        });
    };
}

module.exports = Database;




