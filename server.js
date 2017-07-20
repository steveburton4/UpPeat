var express = require('express'),
  app = express(),
  port = process.env.PORT || 54321;

app.listen(port);

console.log('UpPeat RESTful API server started on: ' + port);