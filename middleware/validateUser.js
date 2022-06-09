const Joi = require('joi');

const Schema = Joi.object({
    username: Joi.string().trim().required(),
    password: Joi.string().min(8).pattern(/^(?:[0-9]+[a-zA-Z]|[a-zA-Z]+[0-9])[a-z0-9A-Z]*$/).trim().required(),
})

const validateUser = (req, res, next) => {
    const { error ,value } = Schema.validate(req.body);
    req.body.username = value.username;
    req.body.password = value.password;
    if (error) {
        req.flash("error","Incorrect credentials");
        return res.redirect("/signup");
    }
    else {
        next();
    }
}

module.exports = validateUser;