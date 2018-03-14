'use strict';

let iothub = require('azure-iothub');
let config = require('../../config/iothub.js');
let registry = iothub.Registry.fromConnectionString(config.iotHost);

module.exports = {
    /**
     * summary:
     * description: Register a new device with the given name.
     * parameters: deviceId
     * produces: application/json, text/json
     * responses: 201, 400, 409
     * operationId: uav_registerDevice
     */
    put: {
        200: function (req, res, callback) {
            registerDevice(req, res);
        }
    },
    get: {
        200: function (req, res, callback) {
            fetchDeviceWithId(req, res);
        }
    },
    delete: {
        204: function (req, res, callback) {
            deleteDevice(req, res);
        }
    }
};

function fetchDeviceWithId(req, res) {
    registry.get(req.params.deviceId, function (error, result, response) {
        if (!error) {
            res.json(result);
        } else {
            console.log("Could not find device");
            res.json({ error: error });
            res.status(400);
        }
    });
};

function deleteDevice(req, res) {
    // TODO: validate deviceid?
    registry.delete(req.params.deviceId, function (error, list, response) {
        if (!error) {
            res.status(204);
            res.end();
        } else {
            res.status(400);
            res.json({ error: 'Could not delete device' });
        }
    });
};

function registerDevice(req, res) {
    // create the device with the given name
    let deviceId = req.params.deviceId;
    let device = new iothub.Device(null);
    // set the id
    device.deviceId = deviceId;
    // call iot hub registry
    registry.create(device, function (err, deviceInfo, response) {
        if (err) {
            res.json({ error: 'Could not register device' });
            res.status = 400;
        } else if (deviceInfo) {
            res.json(deviceInfo);
            res.status = 201;
        } else {
            res.json({ error: 'Device already registered' });
            res.status = 409;
        }
    });
}
