'use strict';

const Protocol = require('azure-iot-device-mqtt').Mqtt;
const Client = require('azure-iot-device').Client;
const Message = require('azure-iot-device').Message;
const config = require('../config/iothub.js');
const connectionString = config.webappConnectionString;
const clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;

/**
 * Operations on /message
 */
module.exports = {
    post: {
        200: function (req, res, callback) {
            sendClientMessage(req.body).then(function (item) {
                res.json(item);
            }).catch(function (error) {
                console.log('Got error: ', error);
                res.status(400);
                res.json(error);
            });
        }
    }
};


function sendClientMessage(messageContent) {
    return new Promise((resolve, reject) => {
        let client = clientFromConnectionString(connectionString);

        var connectCallback = function (err) {
            if (err) {
                console.error('Could not connect: ' + err.message);
            } else {
                console.log('Client connected');
                client.on('message', function (msg) {
                    console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
                    // When using MQTT the following line is a no-op.
                    client.complete(msg, printResultFor('completed'));
                    // The AMQP and HTTP transports also have the notion of completing, rejecting or abandoning the message.
                    // When completing a message, the service that sent the C2D message is notified that the message has been processed.
                    // When rejecting a message, the service that sent the C2D message is notified that the message won't be processed by the device. the method to use is client.reject(msg, callback).
                    // When abandoning the message, IoT Hub will immediately try to resend it. The method to use is client.abandon(msg, callback).
                    // MQTT is simpler: it accepts the message by default, and doesn't support rejecting or abandoning a message.
                });

                // Create a message and send it to the IoT Hub every second
                var data = JSON.stringify(messageContent);

                var message = new Message(data);
                // message.properties.add('key', 'value');
                console.log('Sending message: ' + message.getData());
                client.sendEvent(message, function (err, res) {
                    if (err) {
                        console.error('Error sending message: ', err);
                        reject({ status: 'error', result: err });
                    }
                    if (res) {
                        console.error('Successfully sent message');
                        resolve({ status: 'sent', result: 'OK' });
                    }
                });

                client.on('error', function (err) {
                    console.error(err.message);
                    reject(err);
                });

                /* client.on('disconnect', function () {
                    client.removeAllListeners();
                    client.open(connectCallback);
                });*/
            }
        };

        client.open(connectCallback);
    });
}


function sendTestMessage(messageContent) {
    // send command..
    console.log('Sending message');
    let Message = require('azure-iot-common').Message;
    let messageTest = JSON.stringify(messageContent);
    // add deviceID to the command content..
    let serviceClient = Client.fromConnectionString(connectionString);
    return new Promise((resolve, reject) => {
        serviceClient.open(function (err) {
            if (err) {
                console.log('Could not connect: ' + err.message);
                // res.json(err);
                reject({ status: 'error', result: err });
            } else {
                // serviceClient.getFeedbackReceiver(receiveFeedback);
                let message = new Message(messageTest);
                message.ack = 'full';
                message.messageId = uuid.v4();
                serviceClient.send(targetDevice, message, function (err, res) {
                    if (err) {
                        console.log(op + ' error: ' + err.toString());
                    }
                    if (res) {
                        console.log(op + ' status: ' + res.constructor.name);
                    }
                });
                resolve({ status: 'sent', result: 'OK' });
            };
        });
    });
}
