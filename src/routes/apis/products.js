const express = require('express');
const router = express.Router();
const productsApiController = require('../../controllers/APIs/productsApiController');

router
router.get('/', productsApiController.list),
    router.get('/detail/:id', productsApiController.detail),
    router.get('/add', productsApiController.add),
    router.delete('/delete/:id', productsApiController.destroy)
router.get('/filter/:category', productsApiController.filter);


module.exports = router