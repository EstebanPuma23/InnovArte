'use strict';
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
      await queryInterface.bulkInsert('Users', [
        {
        name: 'Admin',
        surname: 'Admin2',
        email : 'admin@innovarte.com',
        password : bcrypt.hashSync('123123', 10),
        rolId : 2,
        createdAt : new Date,
        updatedAt : new Date
      }
    ], {});
    
  },

  down: async (queryInterface, Sequelize) => {
    
      await queryInterface.bulkDelete('Users', null, {});
     
  }
};
