'use strict';

const config = require('../../../../../../config/db.js');
const uuid = require('node-uuid');

const MeasurementGenerator = require('../../../../../../lib/MeasurementGenerator.js');
const measurementGenerator = new MeasurementGenerator();

const Database = require('../../../../../../lib/Database.js')
const db = new Database();

const ONE_METER_OFFSET = 0.00000899322;
const STEPWIDTH_IN_METERS = 50;
const ALT_STEPS_IN_METERS = 25;

/**
 * Operations on /measurements
 */

let generated = 0;
module.exports = {
    get: {
        200: function (req, res, callback) {
            try {
                console.log('Querying Measurements for location: ', req.params.latitude, req.params.longitude, req.params
                    .radius, req.params
                        .minalt, req.params
                        .maxalt);

                db.queryMeasurementItemsInRange(req.params.latitude,
                    req.params.longitude,
                    req.params.radius,
                    req.params.minalt,
                    req.params.maxalt).then(function (results) {
                        console.log('Done with: ', results.length, ' results');
                        res.json(results);
                    }, function (error) {
                        console.log('Error querying: ', error);
                        res.json(error);
                    });
            } catch (exception) {
                console.log('Exception querying items. ' + exception);
                res.json(exception);
            }
        }
    },
    post: {
        201: function (req, res, callback) {
            console.log('Generating measurements');
            try {
                let generatedMeasurements = measurementGenerator.generateMeasurementsInRange(req.params.latitude, req.params.longitude, req.params.radius, req.params.minalt, req.params.maxalt);
                // generateItemsInRange(req.params.latitude, req.params.longitude, req.params.radius, req.params.minalt, req.params.maxalt);
                measurementGenerator.createMeasurementsIterative(generatedMeasurements, 0);

                res.json({
                    result: 'Created ' + generatedMeasurements.length + '  items'
                })
            } catch (exception) {
                console.log('Exception creating items', exception);
                res.json(exception);
            }
        }
    }
};






