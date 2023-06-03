require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const ejsLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override'); 
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/ppConfig'); 
const isLoggedIn = require('./middleware/isLoggedIn'); 
let billType; 
let billNumber; 
let amendments; 
let actions; 

SECRET_SESSION = process.env.SECRET_SESSION;
console.log('Secret session', SECRET_SESSION); 



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
    console.log(res.locals); 
    res.locals.alerts = req.flash(); 
    res.locals.currentUser = req.user; 
    next(); 
})

app.get('/', function (req, res) {
    axios.get('https://api.congress.gov/v3/bill?api_key=g34wvh7cMZqiTCkY4n3g39Se8vvZBrfTLC3lEg9I')
        .then(function (response) {
            console.log('Bill Data:')
            return res.render('index', { bills: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.use('/auth', require('./controllers/auth'));

// Add this below /auth controllers
app.get('/profile', isLoggedIn, (req, res) => {
    const { id, name, email } = req.user.get();
    res.render('profile', { id, name, email });
});



app.get('/bills', function (req, res) {
    axios.get('https://api.congress.gov/v3/bill?api_key=g34wvh7cMZqiTCkY4n3g39Se8vvZBrfTLC3lEg9I')
        .then(function (response) {
            // handle success
            return res.json({ bills: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/bills/118', function (req, res) {
    axios.get('https://api.congress.gov/v3/bill/118?api_key=g34wvh7cMZqiTCkY4n3g39Se8vvZBrfTLC3lEg9I')
        .then(function (response) {
            // handle success
            return res.json({ bills: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/bills/118/:billtype', function (req, res) {
    axios.get('https://api.congress.gov/v3/bill/118' + billType + '?api_key=g34wvh7cMZqiTCkY4n3g39Se8vvZBrfTLC3lEg9I')
        .then(function (response) {
            // handle success
            return res.json({ bills: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/bills/118/:billtype/:billnumber', function (req, res) {
    axios.get('https://api.congress.gov/v3/bill/118' + billType + billNumber + '?api_key=g34wvh7cMZqiTCkY4n3g39Se8vvZBrfTLC3lEg9I')
        .then(function (response) {
            // handle success
            return res.json({ bills: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/bills/118/:billtype/:billnumber/amendments', function (req, res) {
    axios.get('https://api.congress.gov/v3/bill/118' + billType + billNumber + amendments + '?api_key=g34wvh7cMZqiTCkY4n3g39Se8vvZBrfTLC3lEg9I')
        .then(function (response) {
            // handle success
            return res.json({ bills: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/bills/118/:billtype/:billnumber/actions', function (req, res) {
    axios.get('https://api.congress.gov/v3/bill/118' + billType + billNumber + actions + '?api_key=g34wvh7cMZqiTCkY4n3g39Se8vvZBrfTLC3lEg9I')
        .then(function (response) {
            // handle success
            return res.json({ bills: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/search', function (req, res) {
    res.render('search'); 
})

app.get('/committee', function (req, res) {
    axios.get('https://api.congress.gov/v3/committee?api_key=g34wvh7cMZqiTCkY4n3g39Se8vvZBrfTLC3lEg9I')
    .then(function (response) {
        let result = []; 
        let committees = response.data.committees; 
        for (let i = 0; i < committees.length; i++) {
            let eachCommittee = committees[i]; 
            result.push(eachCommittee); 
        }
        console.log(result); 
        return res.render('committee', { committees: result }); 
    })
    .catch(function (error) {
        res.json({message: 'Data not found. Please try again later'}); 
    })
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