const express = require('express');
const router = express.Router();
const CatchAsync = require('../utils/catchAsync');
const Profile = require('../models/profiles');
const User = require('../models/users');
const validateIntro = require('../middleware/validateIntro');
const validateUser = require('../middleware/validateUser');
const passport = require('passport');
const AppError = require('../utils/appError');
const { isLoggedIn } = require('../middleware/isLoggedIn');
const { ifLoggedIn } = require('../middleware/ifLoggedIn');
const isAuthor = require('../middleware/isAuthor');

router.route('/')
    .get((req, res) => {
        res.render('profiles/home');
    })
router.route('/signin')
    .get(ifLoggedIn, (req, res) => {
        res.render("profiles/signin");
    })
    .post(ifLoggedIn, passport.authenticate('local', { failureFlash: true, failureRedirect: '/signin' }), (req, res) => {
        req.flash("success", "Welcome back!");
        const redirectUrl = req.session.returnTo || `/${req.user.username}`;
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    })
router.route('/signup')
    .get(ifLoggedIn, (req, res) => {
        res.render('profiles/signup');
    })
    .post(ifLoggedIn, validateUser, CatchAsync(async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await new User({ username });
            const registerUser = await User.register(user, password);
            req.login(registerUser, err => {
                if (err) return next(err);
                req.session.newUser = true;
                req.flash("success", "One more step to GO..");
                return res.redirect('/new');
            })
        } catch (err) {
            req.flash("error", "Username already taken");
            res.redirect('/signup');
        }
    }))
router.get('/signout', (req, res) => {
    if (req.user) {
        req.logOut();
        req.flash("success", "GoodBye!");
    }
    res.redirect("/");
})
router.get('/search', CatchAsync(async (req, res, next) => {
    const search = req.query.search.trim();
    if (!search) {
        return res.redirect("/");
    }
    const profiles = await Profile.find({ fullname: { $regex: new RegExp(search), $options: 'i' } }).populate('author');
    res.render('profiles/search', { search, profiles });
}))
router.route('/new')
    .get(isLoggedIn, ifLoggedIn, (req, res) => {
        res.render('profiles/newprofile');
    })
    .post(isLoggedIn, ifLoggedIn, validateIntro, CatchAsync(async (req, res, next) => {
        try {
            const { firstname, lastname } = req.body;
            const fullname = `${firstname} ${lastname}`;
            const profile = await new Profile({ fullname, ...req.body });
            profile.author = req.user._id;
            await profile.save();
            req.flash("success", "Done! Account Created");
            delete req.session.newUser;
            return res.redirect(`/${req.user.username}`);
        } catch (err) {
            if (err.code == 11000) {
                req.flash("error", "Email already taken");
                res.redirect('/new');
            } else {
                throw new AppError("Something went wrong!", 500);
            }
        }
    }))
router.get('/:username', CatchAsync(async (req, res, next) => {
    const user = await User.findOne({ username: req.params.username });
    const profile = await Profile.findOne({ author: user }).populate('author');
    if (!profile) {
        req.flash("error", "User Not found!");
        return res.redirect("/");
    }
    res.render("profiles/profile", { profile });
}))
router.post("/:username/editIntro", isLoggedIn, isAuthor, CatchAsync(async (req, res) => {
    const { firstname, lastname } = req.body;
    const { username } = req.params;
    const fullname = `${firstname} ${lastname}`;
    const user = await User.findOne({ username });
    await Profile.findOneAndUpdate({ author: user }, { fullname, ...req.body });
    res.redirect(`/${username}`);
}))
router.post("/:username/addSummary", isLoggedIn, isAuthor, CatchAsync(async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username });
    await Profile.findOneAndUpdate({ author: user }, req.body);
    res.redirect(`/${username}`);
}))
router.post("/:username/delSummary", isLoggedIn, isAuthor, CatchAsync(async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username });
    const profile = await Profile.findOne({ author: user });
    profile.summary = "";
    profile.save();
    res.redirect(`/${username}`);
}))
router.post("/:username/addLink", isLoggedIn, isAuthor, CatchAsync(async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username });
    const profile = await Profile.findOne({ author: user });
    await profile.links.push(req.body);
    await profile.save();
    res.redirect(`/${username}`);
}))
router.post("/:username/editLink", isLoggedIn, isAuthor, CatchAsync(async (req, res) => {
    const { username } = req.params;
    const link = req.body;
    const user = await User.findOne({ username });
    const profile = await Profile.findOne({ author: user });
    profile.links = profile.links.map(function (l) {
        if (l._id == link.id) {
            l.title = link.title;
            l.url = link.url;
            l.description = link.description;
        }
        return l;
    })
    await profile.save();
    res.redirect(`/${username}`);
}))
router.delete("/:username/delLists/:lid", isLoggedIn, isAuthor, CatchAsync(async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username });
    const profile = await Profile.findOne({ author: user });
    profile.links = profile.links.filter(function (l) {
        return l._id != req.params.lid;
    });
    await profile.save();
    res.redirect(`/${username}`);
}))

module.exports = router;