module.exports = {
       "email": {
           notEmpty: true,
           isEmail: {
               errorMessage: "Invalid email"
           }
       },
       "password": {
           notEmpty: true,
           isLength: {
               options: [{ min: 5, max: 20}],
               errorMessage: "Must be between 5 and 20 characters"
           },
           matches: {
               options: ["^[a-zA-Z0-9_]*$", "g"],
               errorMessage: "Password must be alphanumeric and may contain underscores"
           },
           errorMessage: "Invalid password"
       },
       "user_name": {
           notEmpty: true,
           isLength: {
               options: [{ min: 5, max: 20}],
               errorMessage: "Must be between 5 and 20 characters"
           },
           matches: {
               options: ["^[a-zA-Z0-9_]*$", "g"],
               errorMessage: "Username may contain alphanumeric characters or underscores only"
           },
           errorMessage: "Invalid username"
       },
       "first_name": {
           notEmpty: true,
           errorMessage: "Invalid first name"
       },
       "surname": {
           notEmpty: true,
           errorMessage: "Invalid surname"
       }
};