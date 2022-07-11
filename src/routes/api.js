var express = require('express');
var router = express.Router();
const upload = require('../middlewares/multerImagesProduct');

const {show, add, remove, empty} = require('../controllers/cartApiController');

router
    .get('/carts/show', show)
    .get('/carts/add/:id', add )
    .get('/carts/remove/:id', remove)
    .get('/carts/empty', empty)

module.exports = router;