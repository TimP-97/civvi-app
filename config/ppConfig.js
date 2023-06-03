const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Database
const { user } = require('../models');

const STRATEGY = new LocalStrategy({
    usernameField: 'email',         // looks for an email field as the username
    passwordField: 'password'       // looks for an password field as the password
}, async (email, password, cb) => {
    try {
        const user = await user.findOne({
            where: { email }
        });

        if (!user || !user.validPassword(password)) {
            cb(null, false);     // if no user or invalid password, return false
        } else {
            cb(null, user);
        }
    } catch (err) {
        console.log('------- Error below -----------');
        console.log(err);
    }
})

passport.serializeUser((user, cb) => {
    cb(null, user.id);
}); 

passport.deserializeUser(async (id, cb) => {
    try {
        const user = await user.findByPk(id);

        if (user) {
            cb(null, user)
        }
    } catch (err) {
        console.log('---- Yo... There is an error ----');
        console.log(err);
    }
});

passport.use(STRATEGY);

module.exports = passport;