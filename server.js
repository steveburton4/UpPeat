var express = require('express'),
  server = express(),
  port = process.env.PORT || 54321,
  documentation = require('./configuration/documentationSetup'),
  database = require('./configuration/databaseSetup'),
  app = require('./configuration/appSettings'),
  basePath = '/uppeat',
  documentationDirName = __dirname +'/swagger',
  authentication = require('./configuration/authentication'),
  https = require('https');

var configuredApp = app.createApp();

database.setupDatabase(server);

var appWithDocumentationSetup = documentation(configuredApp, 'https://localhost:'+port+basePath, documentationDirName);

var setupApp = app.setupAppRoutesAndValidation(appWithDocumentationSetup);

server.use(basePath, setupApp);

https.createServer(authentication.options, server).listen(port);

console.log('UpPeat RESTful API server started on: https://0.0.0.0:' + port);