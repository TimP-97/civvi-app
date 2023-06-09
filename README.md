# Civvi 
## Your congressional committee app
###### (with more features to come)

![apppreview](https://i.imgur.com/gVNHBut.png)

Civvi (as in civilian) is an app that lets you search congressional committees and save them to an authentcated user. The central conceit of Civvi is to produce a more engaged and informed electorate who take a proactive approach in the democratic process.

***

### Features
- Create and edit a user 
- Search every congressional legislative committee 
- See data on the committees like which chamber houses them, what their congressional code is and whether or not they have a parent committee. 
- Save committee information to the user to easily access later
- Search committees with a search function
- A short and simple congressional FAQ

***

### Using Civvi 
Features are limited to browsing committees without authentiction. Committees in the drop down nav are sorted by chamber: House, Senate or Joint. You'll need to create a profile to get the most use out of the app. 

![loginpreview](https://i.imgur.com/IPXmPsA.png)

After creating a profile, you'll have the ability to search for committees as well as save them to your account. 

![loginpreview](https://i.imgur.com/ST6NbAX.png)

After you've found your committee, you can save it to your account and easily access it later. 

![committeepreview](https://i.imgur.com/GumytqA.png)
###### (Following page)
![following](https://i.imgur.com/fpsu90g.png)

You can also remove committees that you follow. 

###### (Following page with no items)
![no-follow](https://i.imgur.com/oXNA1MK.png)

To edit your profile information, simply click the profile button on the top right corner of the navigation bar. Then, hit the edit button below the profile information. 

![profile](https://i.imgur.com/bVjsAg9.png)

![profile-edit](https://i.imgur.com/heTX4bF.png)

From here, you can edit your name and log-in email. Then, just log-out when you've finished using the app!

***

### How it works 

#### CSS Library 
- Bulma

#### Technologies used

- HTML
- CSS
- JS
- Node.js
- PSQL

#### Node dependencies featured 

- axios
- bcryptjs
- connect-flash
- dotenv
- ejs
- env 
- express
- express-ejs-layouts
- express-session
- method-override
- nodemon
- passport 
- passport-local
- pg 
- pg-hstore 
- sequelize 
- supertest

> If you're looking to fork and clone this repo, please ensure these dependencies are installed. 

#### API
[Congressional API](https://api.congress.gov/#/)

> This API requires a key

#### The code 

Due to the copious amount of data held within the congressional API, Civvi uses Sequelize to seed the SQL database. The Civvi database is seeded with every committee in the 118th Congress (2023). 

```
'use strict';
const axios = require('axios');
API_KEY = process.env.API_KEY;


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await axios.get('https://api.congress.gov/v3/committee/joint?format=json&offset=0&limit=250' + API_KEY)
      .then(async function (response) { 
        const committees = response.data.committees.map(c => {
          const result = {
            chamber: c.chamber,
            name: c.name,
            systemCode: c.systemCode,
            committeeTypeCode: c.committeeTypeCode,
            parent: JSON.stringify(c.parent),
            url: c.url,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          return result; 
        })
        await queryInterface.bulkInsert('committees', committees, {}); 
          })
       
        
        .catch(function (error) {
            console.log('ERROR!!!', error);
        })
  },    
  
}
```
The app uses express to craft routes that allow users to naviagte the site. 

```
router.get('/', function(req, res) {
    committee.findAll()
        .then(committee => {
            const cleaned_committees = committee.map(c => c.toJSON());
            res.render('committee/committee', {committees: cleaned_committees});
        })
        .catch(error => {
            console.log('ERROR', error); 
            res.render('no-result', { data: 'Committee not found' }); 
        })

})
```

Most of the routes are stored within controllers folders and then imported into the index.js file (the main server file). The controller files hold CRUD functions, like create or delete. 

```
router.post('/add', isLoggedIn, async (req, res) => {
    const committeeId = parseInt(req.body.id);
    const userId = req.user.dataValues.id;
    try {
        const fav = await favorite.findOne({
            where: {
                userId: userId,
                committeeId: committeeId
            }
        });

        if (fav) {
            req.flash('error', 'Committee has already been added to your favorites');
        } else {
            await favorite.create({
                userId: userId,
                committeeId: committeeId
            });
        }
    } catch (error) {
        console.error('Error adding committee to favorites:', error);
    }

   return res.redirect('/favorites');
});


router.delete('/:id', isLoggedIn, async (req, res) => {
    const favoriteId = req.params.id;

    try {
        await favorite.destroy({ where: { committeeId: favoriteId } });
        res.redirect('/favorites');
    } catch (error) {
        console.error('Error deleting favorite:', error);
        res.redirect('/favorites');
    }
});
```
###### Above code pulled from controllers/favorites

### Blockers 
 - The biggest blocker I had was learning how to to manipulate the data coming from the API. There were many unique and trying instances where I had to add qualifiers in order to get the data to seed and render properly. 
 - Also, I needed to seed the data because in order to get everything that I have now, I had too nest three different API calls. In the first API call, there was a URL with more relevant information that also had its own URL with more relevant information. 
 - The issue with manipulating data persisted among all aspects of the project sans auth. So, there were many little blockers along the way. 


### Stretch Goals 
- [ ] Add bill data with the same functionality as current committee data 
- [ ] Add congresspeople data with the same functionality as current committee data 
- [ ] Link all data together through the "Following" page 
- [ ] Link relevant data to respective pages (IE: Show which bills are moving through which committee and by whom on a single committee page)
- [ ] Add an input field that records notes users want to write regarding the various data 
- [ ] Add more FAQ items 
- [ ] Allow users to easily send an email to the congress members of their choice 

