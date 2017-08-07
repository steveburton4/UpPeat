module.exports = {
    "name": {
        notEmpty: true,
        errorMessage: "Missing name"
    },
    "distillery_id": {
        notEmpty: true,
        errorMessage: "Missing distillery id"
    },
    "abv": {
        notEmpty: true,
        errorMessage: "Missing abv"
    },
    "type": {
        notEmpty: true,
        isIn: {
            options: [['malt', 'grain', 'blended', 'single pot', 'bourbon', 'tennessee', 'rye', 'corn', 'rice']],
            errorMessage: 'Invalid type'
        },
        errorMessage: "Missing type"
    }
};