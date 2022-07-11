/* const products = require('../data/products.json');
 */const fs = require ('fs');
const path = require ('path')
const db = require('../database/models')
const { Op } = require('sequelize')
const calcDescuento = (price, discount) => price - (discount * price / 100);
module.exports = {
    index : (req,res) => {
        let ofertas = db.Product.findAll(
            {
                where: {
                    discount: {
                        [Op.gt]: 0 
                    },
                },
                limit: 4
            }
        )
        let products = db.Product.findAll({
            
            limit : 6,
        })

        Promise.all([ofertas,products])

        .then(([ofertas,products])=>{
           
            return res.render('home', {
                ofertas,
                products,
                calcDescuento,
                title : "Inicio"
            })
        })
        .catch(error => console.log(error))
    },
    store : (req,res) => {
        db.Product.findAll()
        .then(products =>{
            return res.render('store', { 
                products,
                title : "Cesta de compras"
            })
        })
    },
    admin : (req,res) => {

        let products = db.Product.findAll({
            include: [{all:true}]
        })
        let categories = db.Category.findAll()
        Promise.all([products,categories])
            .then(([products,categories])=>{
                return res.render('admin',{
                    title : "Administración",
                    products,
                    categories
                })

            })
            .catch(error => console.log(error))




        
    }
}