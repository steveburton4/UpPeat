module.exports = {
    "rating": {
        notEmpty: true,
        errorMessage: "Invalid rating",
        isInt: {
            options: [{ min: 0, max: 10}],
            errorMessage: "Must be an integer between 0 and 10"
        }
    },
    "whiskey_id": {
        notEmpty: true,
        errorMessage: "Missing whiskey id"
    },
    "created_by": {
        notEmpty: true,
        errorMessage: "Missing user id"
    }
};