const fs = require('fs');
const path = require('path');
const { validationResult } = require("express-validator")
    /* const  products = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','products.json'),'utf-8')) */

/* BASE DE DATOS */
const db = require('../database/models');
const { Op } = require('sequelize');
const calcDescuento = (price, discount) => price - (discount * price / 100);
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
module.exports = {
    detail: (req, res) => {
        let product = db.Product.findByPk(req.params.id)
        let category = db.Category.findAll()
        let features = db.Feature.findAll({
            where: {
                productId: {
                    [Op.eq]: req.params.id
                }
            }
        })

        Promise.all([product, features, category])

        .then(([product, features, category]) => {
            return res.render('product-view', {
                product,
                category,
                calcDescuento,
                toThousand,
                features,
                title: 'detalle de producto'
            })
        })
    },
    add: (req, res) => {

        db.Category.findAll()
            .then(categories => {
                return res.render('productAdd', {
                    categories,
                    title: "Agregar producto"
                })
            })
            .catch(error => console.log(error))
    },
    store: (req, res) => {
        let errors = validationResult(req);

        if (errors.isEmpty()) {
            const { name, description, price, discount, feactures, category } = req.body;

            db.Product.create({
                    name: name.trim(),
                    description: description.trim(),
                    price: price,
                    discount: discount,
                    categoryId: category,
                    feactures: feactures.trim(),
                    image: req.file ? req.file.filename : "default-product.jpg"
                })
                .then(product => {
                    let features = req.body.feactures.split("-")
                    let arrayFeatures = features.map(feature => {
                        let item = {
                            name: feature,
                            productId: product.id
                        }
                        return item
                    })
                    console.log(arrayFeatures)
                    db.Feature.bulkCreate(
                            arrayFeatures
                        )
                        .then(feactures => {
                            res.redirect('/admin')
                        })
                        .catch(errors => console.log(errors))
                })
                .catch(errors => console.log(errors))
        } else {
            errors = errors.mapped()
            if (req.fileValidationError) {
                errors = {
                    ...errors,
                    image: {
                        msg: req.fileValidationError,
                    },
                };
            }
            db.Category.findAll()
                .then(categories => {
                    return res.render('productAdd', {
                        categories,
                        errors,
                        title: "Agregar producto",
                        old: req.body
                    })
                })
                .catch(error => console.log(error))
        }
    },
    edit: (req, res) => {

        let product = db.Product.findByPk(req.params.id, {
            include: [{ all: true }]
        })
        let categories = db.Category.findAll()
        let features = db.Feature.findAll({
            where: {
                productId: {
                    [Op.substring]: req.params.id
                }
            }
        })


        Promise.all([product, categories])

        .then(([product, categories]) => {
                return res.render('productEdit', {
                    categories,
                    toThousand,
                    calcDescuento,
                    product,
                    title: "Editar producto"
                })
            })
            .catch(error => console.log(error))

    },
    update: (req, res) => {
        let errors = validationResult(req);

        if (errors.isEmpty()) {
            const { name, description, price, category, discount, image } = req.body;
            db.Product.update({
                    name: name.trim(),
                    description: description.trim(),
                    price,
                    discount: discount,
                    categoryId: category,
                    image: req.file ? req.file.filename : image
                }, {
                    where: {
                        id: req.params.id
                    }
                })
                .then(() => {
                    db.Feature.destroy({
                            where: {
                                productId: req.params.id
                            }
                        })
                        .then(product => {
                            let features = req.body.feactures.split("-")
                            let arrayFeatures = features.map(feature => {
                                let item = {
                                    name: feature,
                                    productId: req.params.id
                                }
                                return item
                            })
                            console.log(arrayFeatures)
                            db.Feature.bulkCreate(
                                    arrayFeatures
                                )
                                .then(feactures => {
                                    res.redirect('/admin')
                                })
                                .catch(errors => console.log(errors))
                        })
                        .catch(errors => console.log(errors))
                })
                .catch(errors => console.log(errors))

        } else {
            console.log(errors)
            let product = db.Product.findByPk(req.params.id, {
                include: [{ all: true }]
            })
            let categories = db.Category.findAll()

            Promise.all([product, categories])
                .then(([product, categories]) => {
                    return res.render('productEdit', {
                        categories,
                        product,
                        title: "Editar producto",
                        old: req.body,
                        errors: errors.mapped(),
                    })
                })
                .catch(error => console.log(error))
        }
    },
    search: (req, res) => {
        let products = db.Product.findAll({
            where: {
                name: {
                    [Op.substring]: req.query.keyword
                }
            }
        })
        let categories = db.Category.findAll();
        Promise.all([products, categories])
            .then(([products, categories]) => {
                return res.render('product-list', {
                    products,
                    toThousand,
                    calcDescuento,
                    categories,
                    title: 'Resultado de la búsqueda'
                })
            })
    },
    filter: (req, res) => {
        let category = db.Category.findByPk(req.query.category, {

            include: [{
                    association: 'products',
                }

            ]
        })
        let categories = db.Category.findAll();

        Promise.all([category, categories])

        .then(([category, categories]) => {
                return res.render('product-list', {
                    title: 'Categoría: ' + req.query.category,
                    categories,
                    products: category.products,
                    toThousand,
                    calcDescuento,
                })
            })
            .catch(error => console.log(error))
    },

    list: (req, res) => {
        let categories = db.Category.findAll()
        let products = db.Product.findAll()

        Promise.all([products, categories])
            .then(([products, categories]) => {
                return res.render('product-list', {
                    products,
                    categories,
                    calcDescuento,
                    toThousand,
                    title: "Listado de productos"
                })
            })
            .catch(error => console.log(error))
    },



    offer: (req, res) => {
        let categories = db.Category.findAll()
        let products = db.Product.findAll({
                where: {
                    discount: {
                        [Op.gt]: 0 
                    }
                }
        })

        Promise.all([products,categories])
            .then(([products, categories]) => {
                return res.render('product-list', {
                    products,
                    categories,
                    toThousand,
                    calcDescuento,
                    title: "Listado de productos"
                })
            })
            .catch(error => console.log(error))
    },
    destroy: (req, res) => {

        db.Product.findByPk(req.params.id)
        .then(imgProduct => {
            if (imgProduct.image != 'default-product.jpg') {
                fs.rm(`./public/images/${imgProduct.image}`, { recursive:true }, (err) => {
                    if(err){
                        // Error de borrado
                        console.error(err.message);
                        return;
                    }
                    console.log("Sos un animal del gol");
                })
            }else {
                console.log('no se borró la imagen por defecto');
                return;
            }
        })
        let features = db.Feature.destroy({
            where: {
                productId: req.params.id
            }
        })

        let product = db.Product.destroy({
            where: {
                id: req.params.id,
            }
        })

        Promise.all([features, product])
            .then(([features, product]) => {
                return res.redirect('/admin')
            })
            .catch(error => console.log(error))
    }
}