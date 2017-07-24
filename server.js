var express = require('express'),
  app = express(),
  port = process.env.PORT || 54321,
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  userRoutes = require('./routes/userRoutes'),
  distilleryRoutes = require('./routes/distilleryRoutes');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/UpPeat-Test'); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

distilleryRoutes(app);
userRoutes(app);

app.listen(port);

console.log('UpPeat RESTful API server started on: ' + port);