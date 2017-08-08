module.exports = function(app)
{
    var userRoutes = require('../routes/userRoutes'),
        ratingRoutes = require('../routes/ratingRoutes'),
        distilleryRoutes = require('../routes/distilleryRoutes'),
        whiskeyRoutes = require('../routes/whiskeyRoutes'),
        locationRoutes = require('../routes/locationRoutes');
        
    distilleryRoutes(app);
    userRoutes(app);
    whiskeyRoutes(app);
    locationRoutes(app);
    ratingRoutes(app);
}