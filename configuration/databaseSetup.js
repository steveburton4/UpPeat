"use strict";

function setupSessionManagement(app, dbConnection) 
{    
    var mongoStoreFactory = require("connect-mongo"),
        session = require("express-session"),
        config = require('./appSettings'),
        MongoStore = mongoStoreFactory(session);

    app.use(session({
        store: new MongoStore
        ({ 
            mongooseConnection: dbConnection,
            ttl: (1 * 60 * 60)
        }),
        secret: 'uppeat',
        saveUninitialized: false,
        resave: false,
        cookie: {
            path: "/",
            maxAge: 1800000,
            httpOnly: false
        },
        name: "uppeat"
    }));

    session.Session.prototype.login = function(user, callback)
    {
        const req = this.req;

        req.session.regenerate(function(err){
            if (err){
                cb(err);
            }
        });
        req.session.userInfo = user;

        callback();
    };
}

module.exports.setupDatabase = function(app)
{
    var mongoose = require('mongoose'),
        config = require('./appSettings'),
        timestampPlugin = require('../models/plugins/timestampPlugin');

    mongoose.Promise = global.Promise;
    mongoose.connect(config.db[app.settings.env], { useMongoClient: true });
    mongoose.plugin(timestampPlugin);

    setupSessionManagement(app, mongoose.connection);
}