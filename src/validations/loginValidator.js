const { body } = require('express-validator');
const bcryptjs = require('bcryptjs');
const db = require('../database/models')

module.exports = [
    body('email')
    .custom((value, { req }) => {
        return db.User.findOne({
                where: {
                    email: value,
                }
            })
            .then(user => {
                if (!user || !bcryptjs.compareSync(req.body.password, user.password)) {
                    return Promise.reject()
                }
            }).catch(() => Promise.reject('Email o contraseña incorrectos!'))
    })
]