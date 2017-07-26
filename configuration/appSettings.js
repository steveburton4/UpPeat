var server = process.env.MONGODB_ADDRESS || "localhost";

module.exports.createApp = function()
{
    var bodyParser = require('body-parser'),
        express = require('express'),
        routes = require('../configuration/routes'),
        app = express();

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(bodyParser());

    routes(app);

    return app;
}

module.exports.db = {
    production: "mongodb://"+server+":27017/UpPeat",
    development: "mongodb://"+server+":27017/UpPeat",
};