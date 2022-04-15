const { check, validationResult } = require('express-validator/check');

module.exports = async function(req, res, next) {

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {

        return res.status(400).json({
            status:'error',
            message:"Invalid Submission.",
            errors:errors.array()
        });

    } else {
        next();
    }
}

