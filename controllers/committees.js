const express = require('express'); 
const router = express.Router(); 
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
    const committeeArray = [];
    console.log('REQUEST!!!!', req.body.category);
    console.log('???USER?????', req.user);
    const userId = req.user.dataValues.id;
    favorite.findAll({
        where: {
            userId: userId
        }
    })
    .then(foundFavorite => {
        committee.findAll()
            .then(committee => {
                const cleaned_committee = committee.map(c => c.toJSON()); 
                if (req.body.category === 'name') {
                    for (let i = 0; i < cleaned_committee.length; i++) {
                        let foundCommittee = cleaned_committee[i];
                        if (foundCommittee.name === req.body.item) {
                            return res.render('./committee/single-committee', {singleCommittee: foundCommittee, userFavorite: foundFavorite})
                        }
                    }
                } else if (req.body.category === 'chamber') {
                    for (let i = 0; i < cleaned_committee.length; i++) {
                        let foundCommittee = cleaned_committee[i];
                        if (foundCommittee.chamber === req.body.item) {
                            committeeArray.push(foundCommittee);
                        }
                    }
                } else if (req.body.category === 'committeeTypeCode') {
                    for (let i = 0; i < cleaned_committee.length; i++) {
                        let foundCommittee = cleaned_committee[i];
                        if (foundCommittee.committeeTypeCode === req.body.item) {
                            committeeArray.push(foundCommittee);
                        }
                    }
                } else if (req.body.category === 'systemCode') {
                    for (let i = 0; i < cleaned_committee.length; i++) {
                        let foundCommittee = cleaned_committee[i];
                        if (foundCommittee.systemCode === req.body.item) {
                            return res.render('./committee/single-committee', { singleCommittee: foundCommittee, userFavorite: foundFavorite })
                        }
                    }
                } else if (req.body.category === 'id') {
                    for (let i = 0; i < cleaned_committee.length; i++) {
                        let foundCommittee = cleaned_committee[i];
                        if (foundCommittee.id === req.body.item) {
                            return res.render('./committee/single-committee', { singleCommittee: foundCommittee, userFavorite: foundFavorite })
                        }
                    }
                }
            console.log('Committee array', committeeArray); 
            return res.render('./committee/search-result', { committees: committeeArray, userFavorite: foundFavorite });
            })
            .catch(error => console.log("ERROR", error));
        })
    .catch(error => {console.log('Error', error); })
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
                favorite.findAll()
                .then(userFavorite => {
                res.render( 'committee/single-committee', { singleCommittee: singleCommittee, committees: committees, userFavorite: userFavorite})
                })
                .catch(error => { (console.log('error', error)) })
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