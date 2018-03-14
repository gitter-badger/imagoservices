'use strict';

let iothub = require('azure-iothub');
let config = require('../../config/iothub.js');
let registry = iothub.Registry.fromConnectionString(config.iotHost);
let Client = require('azure-iothub').Client;
let uuid = require('node-uuid');
let connectionString = config.iotHost;

module.exports = {
    post: {
        201: function (req, res, callback) {
            // send command.. 
            let Message = require('azure-iot-common').Message;
            let targetDevice = req.params.deviceId;
            let requestObject = req.body;
            requestObject.deviceId = targetDevice;
            requestObject.scheduled = Date.now();
            requestObject.commandid = uuid.v4();
            let messageContent = JSON.stringify(requestObject);
            // add deviceID to the command content.. 
            let serviceClient = Client.fromConnectionString(connectionString);
            try {
                serviceClient.open(function (err) {
                    if (err) {
                        console.log('Could not connect: ' + err.message);
                        res.json(err);
                    } else {
                        // serviceClient.getFeedbackReceiver(receiveFeedback);
                        let message = new Message(messageContent);
                        message.ack = 'full';
                        message.messageId = requestObject.commandid;
                        serviceClient.send(targetDevice, message, printResultFor('send'));
                        res.status(201);
                        res.end();
                    }
                });
            } catch (exception) {
                res.status(500);                
                res.json(exception);
            }
        }
    }
};
function printResultFor(op) {
   return function printResult(err, res) {
     if (err) {
            console.log(op + ' error: ' + err.toString());
     } 
     if (res) {
         console.log(op + ' status: ' + res.constructor.name);
     }
   };
 }