var newman = require('newman'); 
 
newman.run({
    collection: require('./UpPeat.postman_collection.json'),
    reporters: ['junit', 'html', 'cli', 'json'],
    environment: require('./localhost.postman_environment.json')
}, function (err) {
    if (err) { throw err; }
    process.exit();
});