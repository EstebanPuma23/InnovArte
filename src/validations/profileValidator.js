const { check, body } = require('express-validator');
const db = require('../database/models')
const bcrypt = require('bcryptjs');

module.exports = [

    body('name')
        .custom((value) => {
            
                let [name, surname] = value.split(' ')
                if (name.length <= 2 || surname.length <= 2) {
                    return false
                } else {
                    return true
                }
            
    }).withMessage('Debe tener un mímino de 3 caracteres'),


    body('passwordOrigin')

        .custom(async (value, { req }) => {
            try {
                let user = await db.User.findOne({
                    where: {
                        email: req.session.userLogin.email
                    }
                })

                if (!(user && bcrypt.compareSync(value, user.password))) {

                    return Promise.reject('Contraseña incorrecta o no ha agregado la contraseña para guardar los cambios')
                }
            } catch (error) {
                console.log(error)
            }

        })

]