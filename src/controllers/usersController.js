const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const { validationResult } = require('express-validator');
const db = require('../database/models')



module.exports = {
    register: (req, res) => {
        return res.render('register', { title: "Registro" });
    },
    processRegister: async (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.mapped())
            return res.render('register', {
                errores: errors.mapped()
            })
        }

        const { name, email, password } = req.body;
        try {
            let userExist = await db.User.findOne({
                where: {
                    email
                }
            })
            if (userExist) {
                return res.redirect('/'), {
                    error: {
                        msg: 'Este mail ya esta registrado'
                    }
                        ('register', {
                            errores: errors.mapped(),
                            old: req.body
                        })
                }

            }
            let names = name.split(' ')
            console.log(names)
            let user = await db.User.create({
                name: names[0].trim(),
                surname: names[1].trim(),
                email: email.trim(),
                password: bcrypt.hashSync(password, 10),
                profile: 'foto-default.jpg',
                rolId: 1

            })
            console.log('Se creo el usuario')
           
            req.session.userLogin = {
                id: user.id,
                name: user.name,
                surname: user.surname,
                profile_picture: user.profile,
                rol: user.rolId
            }
            req.session.carrito = [];
            console.log(req.session.userLogin)
            return res.redirect('/')


        } catch (error) {
            console.log(error);
        }
    },
    login: async (req, res) => {
        return res.render('login', { title: "Inicio de sesión" });

    },
    processLogin: async (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.mapped())
            return res.render('login', {
                errores: errors.mapped()
            })
        }
        let { email, password, remember } = req.body;
        try {
            let user = await db.User.findOne({
                where: {
                    email
                }
            })

            req.session.userLogin = {
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                profile_picture: user.profile,
                rol: user.rolId
            }
            req.session.carrito = [];
            if (remember) {
                res.cookie('InnovArte', req.session.userLogin, { maxAge: 15000 * 60 })
            }
            return res.redirect('/');


        } catch (error) {
            console.log(error);
        }

    },
    logout: (req, res) => {

        if (req.cookies.InnovArte) {
            res.cookie('InnovArte', '', { maxAge: -1 })
        }
        req.session.destroy()
        return res.redirect('/')
    },
    profile: (req, res) => {
        /* let user = db.User.find(user => db.User.id === req.session.userLogin.id);
       return res.send(user)  */

        db.User.findByPk(req.session.userLogin.id, {
            include: [{ all: true }]
        })
            .then(user => {
                return res.render('profile', {
                    user
                })
            })
            .catch(error => console.log(error))

    },


    update: (req, res) => {
        let errors = validationResult(req);

        /* console.log('-----probando(errors.isEmpty() ----------');

        console.log(errors.isEmpty()); */
        //return res.send(errors)

        if (errors.isEmpty() && !req.fileValidationError) {

            db.User.findByPk(req.session.userLogin.id)
                .then(infoUser => {
                    let pass = infoUser.password;
                    if (req.body.password) {
                        pass = bcrypt.hashSync(req.body.password, 10)
                    }
                    let names = req.body.name.split(' ')
                    db.User.update(
                        {

                            name: names[0].trim(),
                            surname: names[1].trim(),
                            password: pass,
                            profile: req.file ? req.file.filename : req.session.userLogin.profile,
                        },
                        {
                            where: {
                                id: req.session.userLogin.id
                            }
                        }
                    ).then(user => {
                        db.User.findOne({
                            where: {
                                id: req.session.userLogin.id
                            }
                        })



                        if (req.file) {
                            if (fs.existsSync(path.join(__dirname, '../public/images/' + user.profile)) && user.profile != "foto-default.jpg") {
                                fs.unlinkSync(path.join(__dirname, '../public/images/' + user.profile))
                            }
                            req.session.userLogin.profile = req.file.filename
                        }
                        req.session.userLogin.name = req.body.name
                        return res.redirect('/')
                    }).catch(error => console.log(error))

                })


        } else {
            db.User.findOne({
                where: {
                    email: req.session.userLogin.email
                }
            }).then(user => {
                errors = errors.mapped()
                if (req.fileValidationError) {
                    errors = {
                        ...errors,
                        image: {
                            msg: req.fileValidationError,
                        },
                    };
                }
                /*  console.log('-----probando error----------');
                return res.send(errors) */
                console.log(errors);
                return res.render('profile', {
                    user,
                    errors
                    // errors: errors.mapped()
                })

            }).catch(error => console.log(error))
        }
    },

    favorite: (req, res) => {
        return res.render('favoritas')
    }
}