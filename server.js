'use strict';

let port = process.env.PORT || 8000; // first change
let Http = require('http');
let Express = require('express');
let BodyParser = require('body-parser');
let Swaggerize = require('swaggerize-express');
let Path = require('path');
let swaggerUi = require('swaggerize-ui'); // second change
// let logger = require('morgan');

let App = Express();

let Server = Http.createServer(App);

App.use(BodyParser.json());
App.use(BodyParser.urlencoded({
    extended: true
}));

App.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE,GET,OPTIONS,HEAD");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

App.use(Swaggerize({
    api: Path.resolve('./config/swagger.json'), // third change
    handlers: Path.resolve('./handlers'),
    docspath: '/swagger' // fourth change
}));

// change four
App.use('/docs', swaggerUi({
    docs: '/swagger'
}));

Server.listen(port, function () {
    console.log('Server running on port: ' + port);
});