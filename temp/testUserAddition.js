
var express = require('express'),
  app = express(),
  port = process.env.PORT || 54321,
  mongoose = require('mongoose'),
  
var connStr = "mongodb://localhost:27017/UpPeat-Test";
mongoose.connect(connStr, function(err) {
    if (err) throw err;
    console.log("Successfully connected to MongoDB");
});

var User = mongoose.model('User');

var testUser = new User({
    user_name: "steveburton4",
    password: "Password123",
    first_name: "steven",
    surname: "burton",
    email: "steven@burton.com"
});

testUser.markModified('object');

testUser.save(function(err) {
    if (err) throw err;

    var Users = mongoose.model('User');

    Users.findOne({ user_name: 'steveburton4' }, function(err, user) {
        if (err) throw err;
        console.log('Fount user:', user.full_name);

        user.comparePassword('Password123', function(err2, isMatch) {
            if (err2) throw err2;
            console.log('Password123:', isMatch);
        });

        user.comparePassword('123Password', function(err3, isMatch) {
            if (err3) throw err3;
            console.log('123Password:', isMatch);
        });
    });
});