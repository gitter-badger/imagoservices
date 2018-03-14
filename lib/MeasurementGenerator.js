'use strict';

global.MEASUREMENT_GENERATOR;

const uuid = require('node-uuid');
const Database = require('./Database.js');
const db = new Database();

const ONE_METER_OFFSET = 0.00000899322;
const STEPWIDTH_IN_METERS = 50;
const ALT_STEPS_IN_METERS = 25;

const MeasurementGenerator = function () {
    const self = this;

    // define functions.

    self.getRandomIntInclusive = function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    self.generateMeasurementsInRange = function (startLat, startLon, radius, minalt, maxalt, groupid) {
        let delta = radius * ONE_METER_OFFSET;
        let generatedMeasurements = [];
        if (!groupid) {
            groupid = uuid.v4();
        }
        for (let lat = startLat; lat < (startLat + delta); lat = lat + (STEPWIDTH_IN_METERS * ONE_METER_OFFSET)) {
            for (let lon = startLon; lon < (startLon + delta); lon = lon + (STEPWIDTH_IN_METERS * ONE_METER_OFFSET)) {
                let alt = 50.0;
                for (alt = minalt; alt < maxalt; alt = alt + ALT_STEPS_IN_METERS) {
                    let ping = self.getRandomIntInclusive(5.0, 70.0);
                    let download = self.getRandomIntInclusive(20.0, 150.0);
                    let upload = self.getRandomIntInclusive(5.0, 50.0);
                    let rssi = - self.getRandomIntInclusive(0, 120);

                    let speedtest = {
                        upload: upload,
                        download: download,
                        ping: ping
                    };
                    let connectioninfo = {
                        rssi: rssi,
                        mode: 'LTE'
                    };
                    let axes = {
                        x: 20,
                        y: 10,
                        z: 100
                    };

                    let measurement = {
                        deviceId: 'MichaelUAV',
                        speedtest: speedtest,
                        connectioninfo: connectioninfo,
                        axes: axes,
                        heading: 210,
                        groupid: groupid,
                        location: {
                            type: 'Point',
                            alt: 10,
                            coordinates: [
                                lon,
                                lat
                            ]
                        },
                    }
                    generatedMeasurements.push(measurement);
                }
            }
        }
        return generatedMeasurements;
    };
    // TODO: change the implementation for generating items for the new format..w
    self.createMeasurementsIterative = function (measurements, i) {
        console.info('Creating entry number: ', i);
        if (i < measurements.length) {
            // create the entry and call yourself again
            let measurement = measurements[i];
            db.createMeasurementEntry(measurement).then(function (result) {
                i++;
                self.createMeasurementsIterative(measurements, i);
            }).catch(function (error) {
                // error??
                console.info('Error creating measurement ', error);
            });
        }
    }
}

module.exports = MeasurementGenerator;
