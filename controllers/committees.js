const express = require('express'); 
const router = express.Router(); 
const axios = require('axios'); 
const { committee } = require('../models'); 

router.get('/', function(req, res) {
    committee.findAll()
        .then(committee => {
            const cleaned_committees = committee.map(c => c.toJSON());
            console.log('cleaned committees', cleaned_committees); 
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
            console.log('cleaned committees', cleaned_committees);
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
            console.log('cleaned committees', cleaned_committees);
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
            console.log('cleaned committees', cleaned_committees);
            res.render('committee/joint', { committees: cleaned_committees });
        })
        .catch(error => {
            console.log('ERROR', error);
            res.render('no-result', { data: 'Committee not found' });
        })
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
                res.render('committee/single-committee', { singleCommittee: singleCommittee, committees: committees });
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