const express = require('express'); 
const router = express.Router(); 
const axios = require('axios'); 
const { committee } = require('../models'); 

router.get('/', function(req, res) {
    committee.findAll()
        .then(committee => {
            const cleaned_committees = committee.map(c => c.toJSON());
            console.log('cleaned committees', cleaned_committees); 
            res.render('committee', {committees: cleaned_committees});
        })
        .catch(error => {
            console.log('ERROR', error); 
            res.render('no-result'); 
        })

})

module.exports = router; 