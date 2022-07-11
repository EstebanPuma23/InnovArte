const fs = require('fs');
const path = require('path');
const { validationResult } = require("express-validator")
    /* const  products = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','products.json'),'utf-8')) */

/* BASE DE DATOS */
const db = require('../../database/models');
const { Op } = require('sequelize');
const { monitorEventLoopDelay } = require('perf_hooks');
module.exports = {
    detail: (req, res) => {
        let product = db.Product.findByPk(req.params.id)
        let features = db.Feature.findAll({
            where: {
                'productId': {
                    [Op.eq]: req.params.id
                }
            }
        })

        Promise.all([product, features])

        .then(([product, features]) => {
                let respuesta = {
                    meta: {
                        status: 200,
                        total: product.length,
                        url: '/api/product/:id'
                    },
                    data: product,
                    dataFeatures: features
                }
                res.json(respuesta)
            })
            .catch(error => console.log(error))
    },
    add: (req, res) => {

        db.Category.findAll()
            .then(categories => {
                let respuesta = {
                    meta: {
                        status: 200,
                        total: categories.length,
                        url: 'api/products/add'
                    },
                    data: categories
                }
                res.json(respuesta)
            })
            .catch(error => console.log(error))
    },
    store: (req, res) => {
        let errors = validationResult(req);

        if (errors.isEmpty()) {
            const { name, description, price, feactures, category } = req.body;

            db.Product.create({
                    name: name.trim(),
                    description: description.trim(),
                    price: price,
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
                let respuesta = {

                }
            })
            .catch(error => console.log(error))

    },
    update: (req, res) => {
        let errors = validationResult(req);

        if (errors.isEmpty()) {
            const { name, description, price, category, image } = req.body;
            db.Product.update({
                    name: name.trim(),
                    description: description.trim(),
                    price,
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
                    categories,
                    title: 'Resultado de la búsqueda'
                })
            })
    },
    filter: (req, res) => {
        let category = db.Category.findByPk(req.params.category, {

            include: [{
                    association: 'products',
                }

            ]
        })
        let categories = db.Category.findAll();

        Promise.all([category, categories])

        .then(([category, categories]) => {
                let respuesta = {
                    meta: {
                        status: 200,
                        url: 'api/filter/:category'
                    },
                    data: category

                }
                res.json(respuesta)
            })
            .catch(res.json({
                malardo: 'malardo'
            }))
    },

    list: (req, res) => {
        let categories = db.Category.findAll()
        let products = db.Product.findAll()

        Promise.all([products, categories])
            .then(([products, categories]) => {
                let respuesta = {
                    meta: {
                        status: 200,
                        total: products.length,
                        url: 'api/products'
                    },
                    data: products,
                    dataCategories: categories
                }
                res.json(respuesta);
            })
            .catch(error => console.log(error))
    },

    destroy: (req, res) => {

        let features = db.Feature.destroy({
            where: {
                productId: req.params.id
            },
            force: true
        })

        let product = db.Product.destroy({
            where: {
                id: req.params.id,
            },
            force: true
        })

        Promise.all([features, product])
            .then(([features, product]) => {
                let respuesta = {
                    meta: {
                        status: 200,
                        total: product.length,
                        url: 'api/products/delete/:id'
                    }
                }
                res.json(respuesta)
            })
            .catch(res.json({
                meta: {
                    status: 404,
                    url: 'api/products/delete/:id',
                }

            }))
    }
}