'use strict';

let uuid = require('node-uuid');

const Database = require('../../../../../lib/Database.js')
const db = new Database();

/**
 * Operations on /measurements
 */

let generated = 0;
module.exports = {
    get: {
        200: function (req, res, callback) {
            try {
                console.log('Querying Measurements range: ', req.params.latitude, req.params.longitude, req.params
                    .radius);

                db.queryMeasurementRangesInRange(req.params.latitude, req.params.longitude, req.params
                    .radius).then(function (results) {
                        console.log('Done with: ', results.length, ' results: ', results);
                        // fetch the groups in range too:
                        db.queryGroupsInRange(req.params.latitude, req.params.longitude, req.params
                            .radius).then(function (groupresults) {
                                // groups fetched..
                                res.json({
                                    groups: groupresults,
                                    range: results
                                }
                                );
                            }).catch(function (error) {
                                // error
                                console.error('Error fetching groups.', error)
                                res.json(error);
                            });

                    }, function (error) {
                        console.log('Error querying: ', error);
                        res.json(error);
                    });
            } catch (exception) {
                console.log('Exception querying items. ' + exception);
                res.json(exception);
            }
        }
    }
};

