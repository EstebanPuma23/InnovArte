'use strict';

let productsjson = require('../../data/products.json');
const faker = require('faker');
const products = [];


productsjson.forEach(product => {
  let item = {
    ...product,
    categoryId : faker.datatype.number({min:1,max:4}),
    createdAt : new Date,
    updatedAt : null,
    deletedAt : null,
  }
    delete item.feactures;
    products.push(item);
  })

 

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
      await queryInterface.bulkInsert('products', products, {});
    
  },

  down: async (queryInterface, Sequelize) => {
   
      await queryInterface.bulkDelete('People', null, {});
    
  }
};
