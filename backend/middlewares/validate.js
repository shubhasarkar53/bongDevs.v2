// import { validationResult } from "express-validator";

const {validationResult} =  require("express-validator");

const Validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let error = {};
        console.log(errors)
        errors.array().map((err) => (error[err.path] = err.msg));
        return res.status(422).json({ error });
    }
    next();
};

module.exports = Validate;