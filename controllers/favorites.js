const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const { committee, favorite, user } = require('../models');
const { restart } = require('nodemon');

// Favorites page route
router.get('/', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user.dataValues.id;
        const userFavorites = await favorite.findAll({
            where: {
                userId: userId
            },
            include: [{ model: committee }]
        });

        const cleanedUserFavorites = userFavorites.map((favorite) => favorite.toJSON());
        console.log('user favorites w/ committee', cleanedUserFavorites[0].committee); 
        res.render('./favorites/favorite', { userFavorite: cleanedUserFavorites});
    } catch (error) {
        console.error('Error retrieving user favorites:', error);
        res.render('./favorites/favorite', { userFavorite: '' });
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


// Delete from favorites route
// router.delete('/:id', isLoggedIn, async (req, res) => {
//     const favoriteId = req.params.id;

//     try {
//         await favorite.destroy({ where: { committeeId: favoriteId } });
//         res.redirect('/favorites');
//     } catch (error) {
//         console.error('Error deleting favorite:', error);
//         res.redirect('/favorites');
//     }
// });

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