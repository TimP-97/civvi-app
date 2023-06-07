const express = require('express'); 
const router = express.Router(); 
const axios = require('axios'); 
const { committee, favorite } = require('../models'); 

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

router.get('/house', function(req, res) {
    committee.findAll({
        where: {
            chamber: 'House'
        }
    })
        .then(committee => {
            const cleaned_committees = committee.map(c => c.toJSON());
            res.render('committee/house', { committees: cleaned_committees });
        })
        .catch(error => {
            console.log('ERROR', error);
            res.render('no-result', { data: 'Committee not found' });
        })
})

router.get('/senate', function (req, res) {
    committee.findAll({
        where: {
            chamber: 'Senate'
        }
    })
        .then(committee => {
            const cleaned_committees = committee.map(c => c.toJSON());
            res.render('committee/senate', { committees: cleaned_committees });
        })
        .catch(error => {
            console.log('ERROR', error);
            res.render('no-result', { data: 'Committee not found' });
        })
})

router.get('/joint', function (req, res) {
    committee.findAll({
        where: {
            chamber: 'Joint'
        }
    })
        .then(committee => {
            const cleaned_committees = committee.map(c => c.toJSON());
            res.render('committee/joint', { committees: cleaned_committees });
        })
        .catch(error => {
            console.log('ERROR', error);
            res.render('no-result', { data: 'Committee not found' });
        })
})

router.get('/search', function (req, res) {
    return res.render('committee/search')
})

router.post('/search', function (req, res) {
    let committeeArray = [];
    committee.findAll()
        .then(committee => {
            // console.log(committee);
            const cleaned_committee = committee.map(c => c.toJSON()); 
            for (let i = 0; i < cleaned_committee.length; i++) {
                let foundCommittee = cleaned_committee[i];
                if (foundCommittee.name = req.body.item) {
                    return res.render(`./committee/single-committee`, {singleCommittee: foundCommittee, userFavorite: 'Hi'})
                } else if (foundCommittee.chamber = req.body.item) {
                    committeeArray.push(foundCommittee);
                } else if (foundCommittee.id = req.body.item) {
                    return res.render(`./committee/single-committee`, { singleCommittee: foundCommittee, userFavorite: 'Hi' })
                } else if (foundCommittee.systemCode = req.body.item) {
                    return res.render(`./committee/single-committee`, { singleCommittee: foundCommittee, userFavorite: 'Hi' })
                } else if (foundCommittee.type = req.body.item) {
                    committeeArray.push(foundCommittee);
                } 
            }
            return res.render('./committee/house', {committees: committeeArray});
        })
        .catch(error => {
        console.log('Error', error);
        })
    console.log('Request info', req.body); 
    // committee.findOne({
    //     where: {name: req.body.item}
    // })
    //     .then(foundCommittee => {
    //         return res.render(`committee/single-committee`, {singleCommittee: foundCommittee, userFavorite: 'How are you?'})
    //     })
    //     .catch(error => {
    //     console.log('Error', error); 
    //     })

})

router.get('/:id', function (req, res) {
    committee.findOne({
        where: {
            id: parseInt(req.params.id)
        }
    })
    
    .then(singleCommittee => {
        committee.findAll()
            .then(committees => {
                res.render( 'committee/single-committee', { singleCommittee: singleCommittee, committees: committees, userFavorite: 'hello'})
            })
            .catch(error => { (console.log('error', error)) })
                
    })
    .catch(error => {(console.log('error', error))})
})


router.get('/:systemCode', function (req, res) {
    committee.findOne({
        where: {
            id: parseInt(req.params.id)
        }
    })
    .then(foundCommittee => {
        favorite.findAll({
            where: {
                userId: req.user.id
            }
        })
            .then(userFavorite => {
                committee.findAll()
                    .then(committees => {

                        res.render('committee/single-committee', { singleCommittee: foundCommittee, committees: committees, userFavorite });
                    })
                    .catch(err => {
                        console.log('Error', err);
                        res.render('no-result', { data: 'Committee not found' });
                    })
    })
            .catch(err => {
                console.log('Error', err);
                res.render('no-result', { data: 'Committee not found' });
            })
    })
    .catch(error => {
        console.log('ERROR', error);
        res.render('no-result', {data: 'Committee not found'});
    })
})

module.exports = router; 