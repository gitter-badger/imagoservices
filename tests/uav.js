'use strict';
let Test = require('tape');
let Express = require('express');
let BodyParser = require('body-parser');
let Swaggerize = require('swaggerize-express');
let Path = require('path');
let Request = require('supertest');
let Mockgen = require('../data/mockgen.js');
let Parser = require('swagger-parser');
/**
 * Test for /uav
 */
Test('/uav', function (t) {
    let apiPath = Path.resolve(__dirname, '../config/swagger.json');
    let App = Express();
    App.use(BodyParser.json());
    App.use(BodyParser.urlencoded({
        extended: true
    }));
    App.use(Swaggerize({
        api: apiPath,
        handlers: Path.resolve(__dirname, '../handlers')
    }));
    Parser.validate(apiPath, function (err, api) {
        t.error(err, 'No parse error');
        t.ok(api, 'Valid swagger api');
        /**
         * summary: 
         * description: 
         * parameters: 
         * produces: application/json, text/json
         * responses: 200
         */
        t.test('test uav_get get operation', function (t) {
            Mockgen().requests({
                path: '/uav',
                operation: 'get'
            }, function (err, mock) {
                let request;
                t.error(err);
                t.ok(mock);
                t.ok(mock.request);
                //Get the resolved path from mock request
                //Mock request Path templates({}) are resolved using path parameters
                request = Request(App)
                    .get('' + mock.request.path);
                if (mock.request.body) {
                    //Send the request body
                    request = request.send(mock.request.body);
                } else if (mock.request.formData){
                    //Send the request form data
                    request = request.send(mock.request.formData);
                    //Set the Content-Type as application/x-www-form-urlencoded
                    request = request.set('Content-Type', 'application/x-www-form-urlencoded');
                }
                // If headers are present, set the headers.
                if (mock.request.headers && mock.request.headers.length > 0) {
                    Object.keys(mock.request.headers).forEach(function (headerName) {
                        request = request.set(headerName, mock.request.headers[headerName]);
                    });
                }
                request.end(function (err, res) {
                    t.error(err, 'No error');
                    t.ok(res.statusCode === 200, 'Ok response status');
                    let Validator = require('is-my-json-valid');
                    let validate = Validator(api.paths['/uav']['get']['responses']['200']['schema']);
                    let response = res.body;
                    if (Object.keys(response).length <= 0) {
                        response = res.text;
                    }
                    t.ok(validate(response), 'Valid response');
                    t.error(validate.errors, 'No validation errors');
                    t.end();
                });
            });
        });
    });
});
