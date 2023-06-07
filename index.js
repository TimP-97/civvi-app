//Declaring global variables and dependencies
require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const session = require('express-session');
const app = express();
const axios = require('axios');
const flash = require('connect-flash');
const passport = require('./config/ppConfig');
const isLoggedIn = require('./middleware/isLoggedIn');
const methodOverride = require('method-override');
const committee = require('./models')
SECRET_SESSION = process.env.SECRET_SESSION;
API_KEY = process.env.API_KEY;

console.log('Secret session', SECRET_SESSION);

//tying dependencies to server
app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: true
}));

// add passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    // console.log(res.locals); 
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next();
})

//home route
app.get('/', function (req, res) {
    axios.get('https://api.congress.gov/v3/bill?api_key=g34wvh7cMZqiTCkY4n3g39Se8vvZBrfTLC3lEg9I')
        .then(function (response) {
            return res.render('index', { bills: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.use('/auth', require('./controllers/auth'));
app.use('/committees', require('./controllers/committees'));
app.use('/favorites', require('./controllers/favorites'));

app.use((req, res, next) => {
    res.status(404).render('no-result', {data: "The page you're looking for does not exist"});
});

// Add this below /auth controllers
app.get('/profile', isLoggedIn, (req, res) => {
    const { id, name, email } = req.user.get();
    res.render('profile', { id, name, email });
});

app.get('/search', function (req, res) {
    res.render('search');
})

app.get('/delete-committee', function (req, res) {
    committee.destroy({
        where: {
            name: 'Mining and Natural Resources Subcommittee'
        }
    })
        .then((deletedRows) => {
            console.log(`${deletedRows} row(s) deleted successfully.`);
        })
        .catch((error) => {
            console.error('Error deleting rows:', error);
        });

})

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, function () {
    console.log(`Server is running on PORT`, PORT);
});

module.exports = {
    server,
    app,
    PORT,
    axios
};

