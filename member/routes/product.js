var express = require('express');
var router = express.Router();

const GetProduct = require('../controllers/product/get_controller');

getProduct = new GetProduct();

router.get('/product', getProduct.getAllProduct);

module.exports = router;