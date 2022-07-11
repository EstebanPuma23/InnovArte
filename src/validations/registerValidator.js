const { body, check } = require('express-validator');
const db = require('../database/models');

module.exports = [

    check('name')
        .notEmpty().withMessage('El nombre y el apellido deben tener un min de 3 caracteres'),

    check('email')
        .notEmpty().withMessage('Debes ingresar tu email').bail()
        .isEmail().withMessage('Email inválido'),

    body('email')
        .custom(value => {
         return db.User.findOne({
             where : {
                 email : value
             }
         }).then( user => {
             if(user){
                 return Promise.reject('El email ya se encuentra registrado')
             }
         })
        }),

     check('password')
        .isLength({
            min: 8,
            max: 12
        }).withMessage('Campo obligatorio'),

    body('repeatpass')
        .custom((value, { req }) => {

            if (value != req.body.password) {
                return false
            } else {
                return true
            }
        }).withMessage('Las contraseñas no coinciden'),

    check('terminos')
        .isString('on').withMessage('Debes aceptar los términos y condiciones')

]