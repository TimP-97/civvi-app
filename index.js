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

// app.get('/committee', function (req, res) {
//     axios.get('https://api.congress.gov/v3/committee/house?format=json&offset=0&limit=250' + '&' + API_KEY)
//         .then(function (response) {
//             let result = [];
//             let committees = response.data.committees;
//             for (let i = 0; i < committees.length; i++) {
//                 let eachCommittee = committees[i];
//                 result.push(eachCommittee);
//             }
//             // console.log(result); 
//             return res.render('committee', { committees: result });
//         })
//         .catch(function (error) {
//             res.json({ message: 'Data not found. Please try again later' });
//         })
// })

// app.get('/committee/:systemCode', function (req, res) {
//     axios.get('https://api.congress.gov/v3/committee?format=json&limit=250&api_key=g34wvh7cMZqiTCkY4n3g39Se8vvZBrfTLC3lEg9I')
//         .then(async function (response) {
//             // console.log('Response----->', response.data.committees); 
//             // console.log('Reqeust --->', req.params.systemCode);

//             // handle success
//             let found = false;
//             let committees = response.data.committees;
//             for (let i in committees) {
//                 let committee = committees[i];
//                 console.log('committee ----->', committee);

//                 if (committee.systemCode === req.params.systemCode) {
//                     found = true;
//                     await axios.get(committee.url + '&' + API_KEY)
//                         .then(async function (singleResponse) {
//                             let newCall = singleResponse.data.committee.communications.url;
//                             console.log('Single Response url ------>', newCall);
//                             await axios.get(newCall + '&' + API_KEY)
//                                 .then(function (newSingleResponse) {
//                                     console.log('New Single Response', newSingleResponse.data);
//                                     return res.render('single-committee', { singleCommittee: committee, allCommittees: response.data.committees, singleCommitteeData: newSingleResponse.data });
//                                 })
                            
//                         })

//                 }
//             }
//             if (!found) {
//                 res.render('no-result', { data: 'Committee does not exist.' });
//             }
//         })
//         .catch(function (error) {
//             res.json({ message: 'Data not found. Please try again later.' });
//         });
// });

app.get('/test', function (req, res) {
    axios.get('https://api.congress.gov/v3/committee/house/hsed00?format=json' + API_KEY)
    .then (function (response) {
        res.json({ data: response.data}); 
    })
    .catch (function (error) {
        res.json({ error }); 
    })
})

app.get('/test1', function (req, res) {
    axios.get('https://api.congress.gov/v3/committee/house/hsed00/house-communication?format=json' + API_KEY)
        .then(function (response) {
            res.json({ data: response.data });
        })
        .catch(function (error) {
            res.json({ error });
        })
})

app.get('/test2', function (req, res) {
    axios.get('https://api.congress.gov/v3/committee/house?format=json&offset=0&limit=250' + API_KEY)
        .then(function (response) {
            res.json({ data: response.data });
        })
        .catch(function (error) {
            res.json({ error });
        })
})

app.get('/test3', function (req, res) {
    // let result = []; 
    let result; 
    axios.get('https://api.congress.gov/v3/committee/house?format=json&offset=0&limit=250' + API_KEY)
        .then(async function (response) {       
            let committees = response.data.committees;
            for (let i in committees) {
                let committee = committees[i];
                // result.push(committee.chamber, committee.name, committee.systemCode, committee.committeeTypeCode, committee.parent);
                result = {chamber: committee.chamber, name: committee.name, systemCode: committee.systemCode, committeeTypeCode: committee.committeeTypeCode, parent: committee.parent, url: committee.url}; 
              
            }
            res.json({ data: result}); 
        })
        .catch(function (error) {
            console.log(error);
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

