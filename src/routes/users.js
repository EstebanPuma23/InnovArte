var express = require('express');
var router = express.Router();

const multer = require('multer')

const loginValidator = require('../validations/loginValidator');
const registerValidator = require('../validations/registerValidator');

const userLoginCheck = require('../middlewares/userLoginCheck');
const notEntry = require('../middlewares/notEntry')
const profileValidator = require('../validations/profileValidator');

const upload = require('../middlewares/multerImageUser');

const {register, processRegister, login, processLogin, logout, profile, update, favorite} = require('../controllers/usersController');

/* GET home page. */
router
    .get('/register',notEntry, register)
    .post('/register',registerValidator, processRegister)
    .get('/login',notEntry, login)
    .post('/login',loginValidator, processLogin)
    .get('/logout',logout)
    .get('/profile',userLoginCheck,  profile)
    .post('/profile',upload.single('profile_picture'),profileValidator, update)
    .get('/favoritas', favorite)

module.exports = router;