const express = require('express');
const router = express.Router();
const passport = require('../config/ppConfig');
const isLoggedIn = require('../middleware/isLoggedIn');

// import models
const { user } = require('../models');

router.get("/signup", (req, res) => {
    return res.render("auth/signup");
});

router.get("/login", (req, res) => {
    return res.render("auth/login");
});

router.get('/edit', (req, res) => {
    const userId = req.user.dataValues.id;
    user.findOne({
        where: {
            id: userId
        }
    })
    .then(foundUser => {
        return res.render('auth/edit', { user: foundUser });
    })
    .catch(error => {
        console.log('error', error);
    })
    
})

router.get('/logout', (req, res) => {
    req.logOut(function (err, next) {
        if (err) { return next(err); }
        req.flash('success', 'Logging out... See you next time!');
        res.redirect('/');
    }); // logs the user out of the session
});

//
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    successFlash: 'Welcome back ...',
    failureFlash: 'Either email or password is incorrect'
}));

//sign-up route
router.post('/signup', async (req, res) => {
    // we now have access to the user info (req.body);
    const { email, name, password } = req.body; // goes and us access to whatever key/value inside of the object
    try {
        const [_user, created] = await user.findOrCreate({
            where: { email },
            defaults: { name, password }
        });

        if (created) {
            // if created, success and we will redirect back to / page
            console.log(`----- ${_user.name} was created -----`);
            const successObject = {
                successRedirect: '/',
                successFlash: `Welcome ${_user.name}. Account was created and logging in...`
            };
            // 
            passport.authenticate('local', successObject)(req, res);
        } else {
            // Send back email already exists
            req.flash('error', 'Email already exists');
            res.redirect('/auth/signup'); // redirect the user back to sign up page to try again
        }
    } catch (error) {
        // There was an error that came back; therefore, we just have the user try again
        console.log('**************Error');
        console.log(error);
        req.flash('error', 'Either email or password is incorrect. Please try again.');
        res.redirect('/auth/signup');
    }
});

//edit user route
router.put('/edit/:id', isLoggedIn, (req, res) => {
    console.log('form data', req.body);
    const userId = req.user.dataValues.id;
    const parsed_user = {...req.body};
    console.log('Parsed User', parsed_user);
    user.update(parsed_user, {
        where: {id: userId}
    })
    .then(numOfRowsChanged => {
        res.redirect('/profile')
        console.log('How many rows were changed?')
    })
    .catch(err => console.log("ERROR", err));
})

module.exports = router;