module.exports.ifLoggedIn = (req,res,next)=>{
    if(!req.session.newUser && req.user){
        return res.redirect(`/${req.user.username}`);
    }
    next();
}