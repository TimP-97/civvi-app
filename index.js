const express = require('express');
const axios = require('axios');
const app = express();
const ejsLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override'); 


app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method')); 

app.get('/', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/company')
        .then(function (response) {
            // handle success
            return res.render('index', { company: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/company')
        .then(function (response) {
            // handle success
            return res.json('index', { company: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
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


app.get('/about', function (req, res) {
    res.sendFile(__dirname + '/views/about.html');
});

app.get('/blog', function (req, res) {
    res.sendFile(__dirname + '/views/blog-directory.html');
});

app.get('/changelog', function (req, res) {
    return res.render('changelog');
});

app.get('/contact', function (req, res) {
    return res.render('contact');
});

app.get('/list', function (req, res) {
    return res.render('list');
});

app.get('/index', function (req, res) {
    return res.render('index');
});

app.get('/search', function (req, res) {
    return res.render('search');
});

app.get('/single', function (req, res) {
    return res.render('single');
});

//================CAPSULES=================


//------------Capsule search page---------------


//--------Return a single capsule by id----------


//---------------Capsule Post Route-----------------
app.use('/capsules', require('./controllers/capsules'));

app.get('/company', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/company')
        .then(function (response) {
            // handle success
            res.json({ data: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

//================CORES=================
app.get('/cores', function (req, res) {

    axios.get('https://api.spacexdata.com/v4/cores')
        .then(function (response) {
            console.log(response.data);
            // handle success
            res.render('cores', { cores: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

//------------Core search page---------------
app.get('/cores/core-search', function (req, res) {
    return res.render('cores/core-search');
})

// ---------Return core by ID-----------
app.get('/cores/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/cores')
        .then(function (response) {

            // handle success
            let found = false;

            for (let i in response.data) {
                let core = response.data[i];

                if (core.id === req.params.id) {
                    found = true;
                    return res.render('single-core', { singleCore: response.data[i], cores: response.data });
                }
            }
            if (!found) {
                res.json({ data: 'Core does not exist.' });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// ---------- Core Post Route -----------
app.post('/cores', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/cores')
        .then(function (response) {
            // handle success
            if (req.body.category === 'serial') {
                for (let i = 0; i < response.data.length; i++) {
                    let core = response.data[i];
                    // check to see if core serial is equal to req.body.item
                    if (core.serial === req.body.item) {
                        // render the core item based on a made route (id)
                        console.log('------------');
                        return res.redirect(`/cores/${core.id}`);
                    }
                }
            } else if (req.body.category === 'reuse_count') {
                const reuseCountCores = response.data.filter((cores) => {
                    if (cores.reuse_count === parseInt(req.body.item)) {
                        return true;
                    } else {
                        return false;
                    }
                });

                res.render('cores', { cores: reuseCountCores });

            } else if (req.body.category === 'rtls_landings') {
                const landLandingsCores = response.data.filter((cores) => {
                    if (cores.rtls_landings === parseInt(req.body.item)) {
                        return true;
                    } else {
                        return false;
                    }


                });
                res.render('cores', { cores: landLandingsCores })

            } else if (req.body.category.toLowerCase() === 'status') {
                const statusCores = response.data.filter((cores) => {
                    if (cores.status === req.body.item) {
                        return true;
                    } else {
                        return false;
                    }


                });
                res.render('cores', { cores: statusCores })

            } else if (req.body.category.toLowerCase() === 'rtls_attempts') {
                const attemptCores = response.data.filter((cores) => {
                    if (cores.rtls_attempts === req.body.item) {
                        return true;
                    } else {
                        return false;
                    }


                });
                res.render('cores', { cores: attemptCores })

            } else if (req.body.category === 'id') {
                for (let i = 0; i < response.data.length; i++) {
                    let core = response.data[i];
                    // check to see if core serial is equal to req.body.item
                    if (core.id === req.body.item) {
                        // render the core item based on a made route (id)
                        console.log('------------');
                        return res.redirect(`/cores/${core.id}`);
                    }
                }
            } else if (req.body.category === 'launches') {
                const launchArray = response.data.filter((core) => {
                    for (let i = 0; i < core.launches.length; i++) {
                        let launch = core.launches[i];
                        if (launch === req.body.item) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                });
                res.render('cores', { cores: launchArray });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

//================CREW=================
app.get('/crew', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/crew')
        .then(function (response) {
            // handle success
            res.render('crew', { crew: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

//------------Crew search page---------------
app.get('/crew/crew-search', function (req, res) {
    return res.render('crew/crew-search');
});

//-------Return a crew member by ID----------
app.get('/crew/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/crew')
        .then(function (response) {
            // handle success
            let found = false;

            for (let i in response.data) {
                let crewmem = response.data[i];
                // console.log(crewmem.name, req.params.name);

                if (crewmem.id === req.params.id) {
                    found = true;
                    return res.render('single-crew', { crewMem: crewmem, crew: response.data });

                }
            }
            if (!found) {
                res.json({ data: 'Crew member does not exist.' });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

//-------------Crew Post Route--------------
app.post('/crew', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/crew')
        .then(function (response) {
            // handle success
            if (req.body.category === 'id') {
                for (let i = 0; i < response.data.length; i++) {
                    let crew = response.data[i];
                    // check to see if crew id is equal to req.body.item
                    if (crew.id === req.body.item) {
                        // render the crew item based on a made route (id)
                        console.log('------------');
                        return res.redirect(`/crew/${crew.id}`);
                    }
                };
            } else if (req.body.category === 'agency') {
                const crewAgency = response.data.filter((crew) => {
                    if (crew.agency === req.body.item.toUpperCase()) {
                        return true;
                    } else {
                        return false;
                    }
                });

                return res.render('crew', { crew: crewAgency });

            } else if (req.body.category.toLowerCase() === 'status') {
                const statusCrew = response.data.filter((crew) => {
                    if (crew.status === req.body.item.toLowerCase()) {
                        return true;
                    } else {
                        return false;
                    }


                });
                return res.render('crew', { crew: statusCrew })

            } else if (req.body.category === 'name') {
                for (let i = 0; i < response.data.length; i++) {
                    let crew = response.data[i];
                    // check to see if crew serial is equal to req.body.item
                    if (crew.name === req.body.item) {
                        // render the crew item based on a made route (id)
                        console.log('------------');
                        return res.redirect(`/crew/${crew.id}`);
                    }
                }
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

//================DRAGONS=================
app.get('/dragons', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/dragons')
        .then(function (response) {
            // handle success
            res.render('dragons', { dragons: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/dragons/dragon-search', function (req, res) {
    return res.render('dragons/dragon-search');
});

// -------Return a single dragon by ID -------
// app.get('/dragons/:id', function (req, res) {
//     axios.get('https://api.spacexdata.com/v4/dragons')
//         .then(function (response) {
//             // handle success
//             let found = false;

//             for (let i in response.data) {
//                 let dragon = response.data[i];

//                 if (dragon.id === req.params.id) {
//                     res.json({ data: response.data[i] });
//                     found = true;
//                 }
//             }
//             if (!found) {
//                 res.json({ data: 'Dragon does not exist.' });
//             }
//         })
//         .catch(function (error) {
//             res.json({ message: 'Data not found. Please try again later.' });
//         });
// });

// Return dragons by Parameter
app.get('/dragons/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/dragons')
        .then(function (response) {
            // handle success
            let found = false;

            for (let i in response.data) {
                let dragon = response.data[i];
                // console.log(crewmem.name, req.params.name);

                if (dragon.id === req.params.id) {
                    found = true;
                    return res.render('single-dragon', { dragon: dragon, dragons: response.data });

                }
            }
            if (!found) {
                res.json({ message: 'Dragon does not exist.' });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// ---------- Dragon Post Route -----------
app.post('/dragons', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/dragons')
        .then(function (response) {
            console.log(req.body.item);
            // handle success
            if (req.body.category === 'id') {
                for (let i = 0; i < response.data.length; i++) {
                    let dragon = response.data[i];
                    // check to see if dragon serial is equal to req.body.item
                    if (dragon.id === req.body.item) {
                        // render the dragon item based on a made route (id)
                        console.log('------------');
                        return res.redirect(`/dragons/${dragon.id}`);
                    }
                }
            } else if (req.body.category === 'type') {
                const dragonTypes = response.data.filter((dragon) => {
                    if (dragon.type === req.body.item) {
                        return true;
                    } else {
                        return false;
                    }
                });

                res.render('dragons', { dragons: dragonTypes });

            } else if (req.body.category === 'active') {
                const activeDragons = response.data.filter((dragon) => {
                    if (dragon.active === req.body.item) {
                        return true;
                    } else {
                        return false;
                    }


                });
                res.render('dragons', { dragons: activeDragons })

            } else if (req.body.category.toLowerCase() === 'crew_capacity') {
                const capacityDragons = response.data.filter((dragon) => {
                    if (dragon.crew_capacity === parseInt(req.body.item)) {
                        return true;
                    } else {
                        return false;
                    }


                });
                res.render('dragons', { dragons: capacityDragons })

            } else if (req.body.category.toLowerCase() === 'orbit_duration_yr') {
                const durationDragon = response.data.filter((cores) => {
                    if (cores.orbit_duration_yr === parseInt(req.body.item)) {
                        return true;
                    } else {
                        return false;
                    }


                });
                res.render('dragons', { dragons: durationDragon })

            } else if (req.body.category === 'name') {
                for (let i = 0; i < response.data.length; i++) {
                    let dragon = response.data[i];
                    // check to see if dragon serial is equal to req.body.item
                    if (dragon.id === req.body.item) {
                        // render the dragon item based on a made route (id)
                        console.log('------------');
                        return res.redirect(`/dragons/${dragon.id}`);
                    }
                }
            }

        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

//============== HISTORY ===================
app.get('/history', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/history')
        .then(function (response) {
            // handle success
            res.json({ data: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

//============== LANDPADS ===================
app.get('/landpads', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/landpads')
        .then(function (response) {
            // handle success
            console.log(response.data);
            res.render('landpads', { landpads: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

//------------- LANDPAD SEARCH ---------------
app.get('/landpads/landpads-search', function (req, res) {
    return res.render('landpads/landpads-search');
});

//----------- Return a single landpad by ID -----------
app.get('/landpads/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/landpads')
        .then(function (response) {
            // handle success
            let found = false;

            for (let i in response.data) {
                let landpad = response.data[i];
                // console.log(crewmem.name, req.params.name);

                if (landpad.id === req.params.id) {
                    found = true;
                    return res.render('single-landpad', { landpad: landpad, landpads: response.data });

                }
            }
            if (!found) {
                res.json({ data: 'Crew member does not exist.' });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });

});

//---------------Landpads Post Route-----------
app.post('/landpads', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/landpads')
        .then(function (response) {
            console.log(req.body.item);
            // handle success
            if (req.body.category === 'id') {
                for (let i = 0; i < response.data.length; i++) {
                    let landpad = response.data[i];
                    // check to see if landpad serial is equal to req.body.item
                    if (landpad.id === req.body.item) {
                        // render the landpad item based on a made route (id)
                        console.log('------------');
                        return res.redirect(`/landpads/${landpad.id}`);
                    }
                }
            } else if (req.body.category === 'type') {
                const landpadTypes = response.data.filter((landpad) => {
                    if (landpad.type === req.body.item) {
                        return true;
                    } else {
                        return false;
                    }
                });

                res.render('landpads', { landpads: landpadTypes });

            } else if (req.body.category === 'status') {
                const activeLandpads = response.data.filter((landpad) => {
                    if (landpad.status === req.body.item) {
                        return true;
                    } else {
                        return false;
                    }


                });
                res.render('landpads', { landpads: activeLandpads })

            } else if (req.body.category.toLowerCase() === 'region') {
                const regionLandpads = response.data.filter((landpad) => {
                    if (landpad.region === req.body.item) {
                        return true;
                    } else {
                        return false;
                    }


                });
                res.render('landpads', { landpads: regionLandpads })

            } else if (req.body.category.toLowerCase() === 'full_name') {
                const fullNameLandpad = response.data.filter((landpad) => {
                    if (landpad.full_name === req.body.item) {
                        return true;
                    } else {
                        return false;
                    }


                });
                res.render('landpads', { landpads: fullNameLandpad })

            } else if (req.body.category === 'name') {
                for (let i = 0; i < response.data.length; i++) {
                    let landpad = response.data[i];
                    // check to see if landpad serial is equal to req.body.item
                    if (landpad.name === req.body.item) {
                        // render the landpad item based on a made route (id)
                        console.log('------------');
                        return res.redirect(`/landpads/${landpad.id}`);
                    }
                }
            }

        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

//============== LAUNCHES ===================
app.get('/launches', function (req, res) {
    axios.get('https://api.spacexdata.com/v5/launches')
        .then(function (response) {
            // handle success
            res.render('launches', { launches: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/launches/launch-search', function (req, res) {
    return res.render('launches/launch-search');
});

// Return a single launch by ID
// app.get('/launches/:id', function (req, res) {
//     axios.get('https://api.spacexdata.com/v5/launches')
//         .then(function (response) {
//             // handle success
//             let found = false;

//             for (let i in response.data) {
//                 let launch = response.data[i];

//                 if (launch.id === req.params.id) {
//                     res.json({ data: response.data[i] });
//                     found = true;
//                 }
//             }
//             if (!found) {
//                 res.json({ data: 'Launch does not exist.' });
//             }
//         })
//         .catch(function (error) {
//             res.json({ message: 'Data not found. Please try again later.' });
//         });
// });

// Return launches by Parameter
app.get('/launches/*', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/launches')
        .then(function (response) {
            // print req.params, API response
            // console.log('req.params', req.params); // print an object
            // console.log('response', response.data); // print an array of launches

            // run a for loop to search based on the key from req.params
            const launchArray = [];
            for (let i in response.data) {
                let launch = response.data[i];
                let userRequest = req.params['0'].split('/'); // ['serial', 'c103'] ['reuse_count', '0']

                if (userRequest[0].toLowerCase() === 'name') { // search by name
                    if (launch.name.toUpperCase() === userRequest[1].toUpperCase()) {
                        return res.json({ launch });
                    }
                } else if (userRequest[0].toLowerCase() === 'id') { // search by id
                    if (launch.id.toUpperCase() === userRequest[1].toUpperCase()) {
                        return res.json({ launch });
                    }
                } else if (userRequest[0].toLowerCase() === 'region') { // search by region
                    if (launch.region.toUpperCase() === userRequest[1].toUpperCase()) {
                        return res.json({ launch });
                    }
                } else if (userRequest[0].toLowerCase() === 'flight_number') { // search by flight_number
                    let flightNumber = parseInt(userRequest[1]);
                    if (launch.flight_number === flightNumber) {
                        launchArray.push(launch);
                    }
                } else if (userRequest[0].toLowerCase() === 'success') { // search by success
                    if ((launch.success === true && userRequest[1].toLowerCase() === 'true') || (launch.success === false && userRequest[1].toLowerCase() === 'false')) {
                        launchArray.push(launch);
                    }
                } else {
                    return res.json({ message: 'Invalid key.' });
                }
            }

            if (launchArray.length > 0) {
                return res.json({ launches: launchArray });
            } else {
                return res.json({ message: 'No matching launches.' });
            }
        });
});

//============ LAUNCHPADS =================
app.get('/launchpads', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/launchpads')
        .then(function (response) {
            // handle success
            res.render('launchpads', { launchpads: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

//------------ Search Route ---------------
app.get('/launchpads/launchpad-search', function (req, res) {
    return res.render('launchpads/launchpad-search');
});

//-----Return launchpads by Parameter-------
app.get('/launchpads/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/launchpads')
        .then(function (response) {
            // handle success
            let found = false;

            for (let i in response.data) {
                let launchpad = response.data[i];
                // console.log(crewmem.name, req.params.name);

                if (launchpad.id === req.params.id) {
                    found = true;
                    return res.render('single-launchpad', { launchpad: launchpad, launchpads: response.data });

                }
            }
            if (!found) {
                res.json({ data: 'data does not exist.' });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });

});

//--------- Launchpad Post Route -----------
app.post('/launchpads', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/launchpads')
        .then(function (response) {
            console.log(req.body.item);
            // handle success
            if (req.body.category === 'id') {
                for (let i = 0; i < response.data.length; i++) {
                    let launchpad = response.data[i];
                    // check to see if launchpad serial is equal to req.body.item
                    if (launchpad.id === req.body.item) {
                        // render the launchpad item based on a made route (id)
                        console.log('------------');
                        return res.redirect(`/launchpads/${launchpad.id}`);
                    }
                }
            } else if (req.body.category === 'locality') {
                const launchpadLocalities = response.data.filter((launchpad) => {
                    if (launchpad.locality === req.body.item) {
                        return true;
                    } else {
                        return false;
                    }
                });

                res.render('launchpads', { launchpads: launchpadLocalities });

            } else if (req.body.category === 'status') {
                const activeLaunchpads = response.data.filter((launchpad) => {
                    if (launchpad.status === req.body.item) {
                        return true;
                    } else {
                        return false;
                    }


                });
                res.render('launchpads', { launchpads: activeLaunchpads })

            } else if (req.body.category.toLowerCase() === 'region') {
                const regionLaunchpads = response.data.filter((launchpad) => {
                    if (launchpad.region === req.body.item) {
                        return true;
                    } else {
                        return false;
                    }


                });
                res.render('launchpads', { launchpads: regionLaunchpads })

            } else if (req.body.category.toLowerCase() === 'full_name') {
                const fullNameLaunchpad = response.data.filter((launchpad) => {
                    if (launchpad.full_name.toLowerCase() === req.body.itemtoLowerCase()) {
                        return true;
                    } else {
                        return false;
                    }


                });
                res.render('launchpads', { launchpads: fullNameLaunchpad })

            } else if (req.body.category === 'name') {
                for (let i = 0; i < response.data.length; i++) {
                    let launchpad = response.data[i];
                    // check to see if launchpad serial is equal to req.body.item
                    if (launchpad.name === req.body.item) {
                        // render the launchpad item based on a made route (id)
                        console.log('------------');
                        return res.redirect(`/launchpads/${launchpad.id}`);
                    }
                }
            } else if (req.body.category === 'timezone') {
                let result = [];
                for (let i = 0; i < response.data.length; i++) {
                    const launchpad = response.data[i];
                    if (launchpad.timezone.split('_').join(' ').toLowerCase().includes(req.body.item.toLowerCase())) {
                        result.push(launchpad);
                    }
                }
                if (!result.length) {
                    res.render('no-result', {item: req.body.item, search: 'Launchpads'})

                } else {
                    return res.render('launchpads', { launchpads: result });
                }
            }



        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/payloads', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/payloads')
        .then(function (response) {
            // handle success
            res.json({ data: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// Return a single payload by ID
app.get('/payloads/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/payloads')
        .then(function (response) {
            // handle success
            let found = false;

            for (let i in response.data) {
                let payload = response.data[i];

                if (payload.id === req.params.id) {
                    res.json({ data: response.data[i] });
                    found = true;
                }
            }
            if (!found) {
                res.json({ data: 'Payload does not exist.' });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/roadster', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/roadster')
        .then(function (response) {
            // handle success
            res.json({ data: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/rockets', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/rockets')
        .then(function (response) {
            // handle success
            res.json({ data: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// Return a rocket by Name
app.get('/rockets/:name', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/rockets')
        .then(function (response) {
            // handle success
            let found = false;

            for (let i in response.data) {
                let rocket = response.data[i];

                if (rocket.name === req.params.name) {
                    res.json({ data: response.data[i] });
                    found = true;
                }
            }
            if (!found) {
                res.json({ data: 'Rocket does not exist.' });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/ships', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/ships')
        .then(function (response) {
            // handle success
            res.json({ data: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// Return a ship by Name
app.get('/ships/:name', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/ships')
        .then(function (response) {
            // handle success
            let found = false;

            for (let i in response.data) {
                let ship = response.data[i];

                if (ship.name === req.params.name) {
                    res.json({ data: response.data[i] });
                    found = true;
                }
            }
            if (!found) {
                res.json({ data: 'Ship does not exist.' });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/starlink', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/starlink')
        .then(function (response) {
            // handle success
            res.json({ data: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// Return a single payload by ID
app.get('/starlink/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/starlink')
        .then(function (response) {
            // handle success
            let found = false;

            for (let i in response.data) {
                let satellite = response.data[i];

                if (satellite.id === req.params.id) {
                    res.json({ data: response.data[i] });
                    found = true;
                }
            }
            if (!found) {
                res.json({ data: 'Satellite does not exist.' });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/search', (req, res) => {
    // parse query string
    let item, searchBy, searchVal;

    for (let key in req.query) {
        switch (key) {
            case 'item':
                item = req.query[key];
                break;
            default:
                searchBy = key;
                searchVal = req.query[key];
                break;
        }
    }

    axios.get(`https://api.spacexdata.com/v4/${item}`)
        .then(function (response) {
            // handle success
            let found = false;

            for (let i in response.data) {
                let loopItem = response.data[i];

                if (loopItem[searchBy] === searchVal) {
                    res.json({ data: response.data[i] });
                    found = true;
                }
            }
            if (!found) {
                res.json({ message: `No matching item found.` });
            }
        })
        .catch((error) => {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/:input', function (req, res) {
    // console.log('req.params', req.params);
    res.json({ message: `There is no data for /${req.params.input}` });
});

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, function () {
    console.log(`Server is running on PORT`, PORT);
});

module.exports = {
    server,
    app,
    PORT,
    axios
};