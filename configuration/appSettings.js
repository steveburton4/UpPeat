var server = process.env.MONGODB_ADDRESS || "localhost";

module.exports.createApp = function()
{
    var bodyParser = require('body-parser'),
        express = require('express'),
        routes = require('./routes'),
        validator = require('express-validator'),
        passport = require('./passport'),
        app = express();


    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(validator());
    
    app.use(passport.initialize());
    app.use(passport.session());
    
    routes(app);

    app.use(function(req, res) {
        res.status(404).send({url: req.originalUrl + ' not found'})
    });

    return app;
}

module.exports.db = {
    production: "mongodb://"+server+":27017/UpPeat",
    development: "mongodb://"+server+":27017/UpPeat",
};