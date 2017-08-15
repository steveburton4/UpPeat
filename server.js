var express = require('express'),
  server = express(),
  port = process.env.PORT || 54321,
  documentation = require('./configuration/documentationSetup'),
  database = require('./configuration/databaseSetup'),
  app = require('./configuration/appSettings'),
  basePath = '/uppeat',
  documentationDirName = __dirname +'/swagger',
  http = require('http');

var configuredApp = app.createApp();

database.setupDatabase(server);

var appWithDocumentationSetup = documentation(configuredApp, 'http://localhost:'+port+basePath, documentationDirName);

var setupApp = app.setupAppRoutesAndValidation(appWithDocumentationSetup);

server.use(basePath, setupApp);

http.globalAgent.maxSockets = 50;

http.createServer(server).listen(port, "0.0.0.0");

console.log('UpPeat RESTful API server started on: http://0.0.0.0:' + port);