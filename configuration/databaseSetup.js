module.exports = function(app)
{
    var mongoose = require('mongoose'),
        config = require('./appSettings');

    mongoose.Promise = global.Promise;
    mongoose.connect(config.db[app.settings.env], { useMongoClient: true });
}