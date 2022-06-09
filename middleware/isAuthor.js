const User = require('../models/users');
const isAuthor = async (req,res,next)=>{
    const {username} = req.params;
    const user = await User.findOne({username});
    if(!user._id==req.user._id){
        req.flash("error","You dont have permission to do that.");
        return res.redirect("/");
    }
    next();
}
module.exports = isAuthor;