module.exports = function(app)
{
    var userRoutes = require('../routes/userRoutes'),
        distilleryRoutes = require('../routes/distilleryRoutes');
        
    distilleryRoutes(app);
    userRoutes(app);
}