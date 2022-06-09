const Joi = require('joi');

const IntroSchema = Joi.object({
    firstname: Joi.string().trim().required(),
    lastname: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    country: Joi.string().trim().required(),
    role: Joi.string().trim().required(),
})

const validateIntro = (req, res, next) => {
    const { error, value } = IntroSchema.validate(req.body);
    req.body.firstname = value.firstname;
    req.body.lastname = value.lastname;
    req.body.email = value.email;
    req.body.role = value.role;
    if (error) {
        console.log(error)
        req.flash("error","Incorrect credentials");
        return res.redirect("/new");
    }
    else {
        next();
    }
}

module.exports = validateIntro;