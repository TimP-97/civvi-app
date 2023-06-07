const express = require('express');
const router = express.Router();
const axios = require('axios');
const isLoggedIn = require('../middleware/isLoggedIn');
const { committee, favorite, user } = require('../models');
const app = express();

// Favorites page route
router.get('/', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user.dataValues.id;
        const userFavorites = await favorite.findAll({
            where: {
                userId: userId
            }
        });
        for (const userFavorite of userFavorites) {
            try {
                const committeeId = userFavorite.committeeId;
                committee.findAll({
                    where: {
                        id: committeeId
                    }
                })
                    .then(foundCommittee => {
                        const cleaned_committee = foundCommittee.map(c => c.toJSON())
                        return res.render('./favorites/favorite', { userFavorite: cleaned_committee });
                    })
                    .catch(error => { console.log('ERROR', error) })
            } catch (error) {
                console.error('ERROR:', error);
            }
        }

    } catch (error) {
        console.error('Error retrieving user favorites:', error);
        res.render('no-result', { data: "You don't have any favorites" });
    }
});

//Add to favorites route 
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


// Delete from favorites route
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

module.exports = router;