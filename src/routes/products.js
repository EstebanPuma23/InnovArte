var express = require('express');
var router = express.Router();


/*Validaciones*/
const adminUserCheck = require('../middlewares/adminUserCheck');
const productValidator = require('../validations/productValidator');

/*Controlador*/
const { detail, add, store, edit, update, list, destroy, search, filter, off } = require('../controllers/productsController');

/*storage multer*/
var upload = require('../middlewares/multerImagesProduct')

/*Rutas products*/
router
    .get('/detail/:id', detail)
    .get('/add', adminUserCheck, add)
    .post('/add', upload.single('image'), productValidator, store)
    .get('/edit/:id', adminUserCheck, edit)
    .put('/update/:id', upload.single('image'), productValidator, update)
    .delete('/destroy/:id', destroy)
    .get('/product-list', list)
    .get('/ofertas', off)
    .get('/search', search)
    .get('/filter', filter);


module.exports = router;