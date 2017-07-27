module.exports = function(app)
{
    var userRoutes = require('../routes/userRoutes'),
        distilleryRoutes = require('../routes/distilleryRoutes'),
        whiskeyRoutes = require('../routes/whiskeyRoutes');
        
    distilleryRoutes(app);
    userRoutes(app);
    whiskeyRoutes(app);
}