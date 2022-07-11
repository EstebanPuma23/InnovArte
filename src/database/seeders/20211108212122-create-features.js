'use strict';

let productsjson = require('../../data/products.json');

const caracteristicas = [];

productsjson.forEach(product => {
  product.feactures.forEach(feature => {
    let caracteristica ={
    name : feature,
    productId : product.id,
    createdAt : new Date,
    updatedAt : new Date
    }
    caracteristicas.push(caracteristica);
  });
}  
);



module.exports = {
  up: async (queryInterface, Sequelize) => {
    
      await queryInterface.bulkInsert('Features', caracteristicas, {});
    
  },

  down: async (queryInterface, Sequelize) => {
   
      await queryInterface.bulkDelete('Features', null, {});
    
  }
};