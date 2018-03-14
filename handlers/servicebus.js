'use strict';

let servicebusClient = require('../data/servicebus.js');
/**
 * Operations on /uav
 */
module.exports = {
    get: function message_check(req, res, next) {
        let status = 200;
        servicebusClient.messagesAvailable('zonecheckbus',function(result){
            res.status(status).send(result);
        });
    }
};
