var express = require('express'),
  server = express(),
  port = process.env.PORT || 54321,
  documentation = require('./configuration/documentationSetup'),
  database = require('./configuration/databaseSetup'),
  app = require('./configuration/appSettings'),
  basePath = '/uppeat',
  documentationDirName = __dirname +'/swagger';

database(server);

var configuredApp = app.createApp();
var documentationSubPath = documentation(configuredApp, 'http://localhost:'+port+basePath, documentationDirName);

server.use(basePath, documentationSubPath);
server.listen(port, '0.0.0.0');

console.log('UpPeat RESTful API server started on: http://0.0.0.0:' + port);