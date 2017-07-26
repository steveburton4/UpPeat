var express = require('express'),
  app = express(),
  subpath = express(),
  server = express(),
  port = process.env.PORT || 54321,
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  userRoutes = require('./routes/userRoutes'),
  distilleryRoutes = require('./routes/distilleryRoutes'),
  argv = require('minimist')(process.argv.slice(2));

var config = require('./config');
mongoose.Promise = global.Promise;
mongoose.connect(config.db[app.settings.env]); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser());

distilleryRoutes(app);
userRoutes(app);

app.use("/v1", subpath);

var swagger = require('swagger-node-express').createNew(subpath);
app.use(express.static('dist'));

swagger.setApiInfo({
	    title: "UpPeat API",
	    description: "API to provide CRUD functionality for UpPeat data",
	    termsOfServiceUrl: "",
	    contact: "steven.burton@hotmail.co.uk",
	    license: "Steven Burton",
	    licenseUrl: ""
	});

app.get('/v1', function (req, res) {
    res.sendFile(__dirname +'/dist/index.html');
});

swagger.configureSwaggerPaths('', 'api-docs', '');
swagger.setAppHandler(subpath);
swagger.configure("http://localhost:54321/uppeat/v1", "1.0.1");

server.use('/uppeat', app);
server.listen(port);

console.log('UpPeat RESTful API server started on: ' + port);