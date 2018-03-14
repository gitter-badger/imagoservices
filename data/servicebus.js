'use strict';
const azure = require('azure');
const serviceBusService = azure.createServiceBusService();

module.exports = {
    /* gets the deadletter message count from the queue */
    messagesAvailable(queueName, callback){

        /*            serviceBusService.receiveQueueMessage('zonecheckbus', function (error, receivedMessage) {
                        if (!error) {
                            // Message received and deleted
                        }
                    });
                    */
        /*serviceBusService.receiveQueueMessage('zonecheckbus', { isPeekLock: true }, function (error, lockedMessage) {
            if (!error) {
                // Message received and locked
                serviceBusService.deleteMessage(lockedMessage, function (deleteError) {
                    if (!deleteError) {
                        // Message deleted
                    }
                });
            }
        });
        */
        serviceBusService.receiveQueueMessage(queueName, { isPeekLock: true }, function (err, lockedMessage) {
            if (err) {
            if (err == 'No messages to receive') {
                callback(false);
            } else {
                callback(err);
            }
            } else {
                callback(true);
            }
        });
    }
};
