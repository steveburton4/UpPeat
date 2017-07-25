var server = process.env.MONGODB_ADDRESS || "localhost";

module.exports = {  
    db: {
        production: "mongodb://"+server+":27017/UpPeat",
        development: "mongodb://"+server+":27017/UpPeat",
    }
};