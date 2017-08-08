var fs = require('fs');
  
module.exports.options = {
    key: fs.readFileSync("./certificates/server/server-key.pem"),
    cert: fs.readFileSync("./certificates/server/server.crt"),
    ca: fs.readFileSync('./certificates/ca/ca.crt'),
    requestCert: true,
    rejectUnauthorized: false
}