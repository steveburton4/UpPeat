var server = process.env.MONGO_PORT_27017_TCP_ADDR || "localhost";

module.exports.createApp = function(options)
{
    var bodyParser = require('body-parser'),
        express = require('express'),
        passport = require('./passport'),
        app = express();

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    
    app.use(passport.initialize());
    app.use(passport.session());

    return app;
}

module.exports.setupAppRoutesAndValidation = function(app)
{
    var routes = require('./routes'),
        validator = require('express-validator');
    
    app.use(validator());
    routes(app);

    app.get('/status', function (req, res) {
        res.status(200).send({status: 'active'});
    });

    app.use(function(req, res) {
        res.status(404).send({url: req.originalUrl + ' not found'})
    });

    return app;
}

module.exports.db = {
    production: "mongodb://"+server+":27017/UpPeat",
    development: "mongodb://"+server+":27017/UpPeat",
};