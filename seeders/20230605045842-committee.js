'use strict';
const axios = require('axios');



/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await axios.get('https://api.congress.gov/v3/committee/joint?format=json&offset=0&limit=250&api_key=g34wvh7cMZqiTCkY4n3g39Se8vvZBrfTLC3lEg9I')
      .then(async function (response) { 
        const committees = response.data.committees.map(c => {
          const result = {
            chamber: c.chamber,
            name: c.name,
            systemCode: c.systemCode,
            committeeTypeCode: c.committeeTypeCode,
            bills: '',
            billsCount: null,
            history: [''],
            communications: [''],
            parent: JSON.stringify(c.parent),
            url: c.url,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          return result; 
        })
        await queryInterface.bulkInsert('committees', committees, {}); 
        // let committees1 = response.data.committees; 
        // for (let i in committees1) {
        //   let committee = committees1[i]; 
        //   result = { chamber: committee.chamber, name: committee.name, systemCode: committee.systemCode, committeeTypeCode: committee.committeeTypeCode, parent: committee.parent, url: committee.url }; 
        //     }
        // const committees = [{
        //   chamber: result.chamber,
        //   name: result.name,
        //   systemCode: result.systemCode,
        //   committeeTypeCode: result.committeeTypeCode,
        //   bills: '',
        //   billsCount: null,
        //   history: [''],
        //   communications: [''],
        //   parent: JSON.stringify(result.parent),
        //   url: result.url,
        //   createdAt: new Date().toISOString(),
        //   updatedAt: new Date().toISOString()
        // }]
        // await queryInterface.bulkInsert('committees', committees, {})
          })
       
        
        .catch(function (error) {
            console.log('ERROR!!!', error);
        })
  },    
  

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
}


