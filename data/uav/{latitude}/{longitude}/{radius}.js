'use strict';

const Database = require('../../../../lib/Database.js')
const db = new Database();

module.exports = {
    get: {
        200: function (req, res, callback) {
            try {
                db.queryUAVsInRange(req.params.latitude, req.params.longitude, req.params
                    .radius,
                    req.query.filter).then(function (results) {
                        res.json(results);
                    }, function (error) {
                        console.log(error);
                        console.log("Got error " + JSON.stringify(error));
                        res.json(error);
                    });

            } catch (exception) {
                console.log("Got exception ", exception);
                res.json(exception);
            }
        }
    }
};
