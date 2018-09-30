var express = require('express');
var router = express.Router();

const OrderGetMethod = require('../controllers/order/get_controller');
const OrderModifyMethod = require('../controllers/order/modify_controller');

orderGetMethod = new OrderGetMethod();
orderModifyMethod = new OrderModifyMethod();


// 取得全部訂單資料
router.get('/order', orderGetMethod.getAllOrder);

// 訂整筆訂單
router.post('/order', orderModifyMethod.postOrderAllProduct);

module.exports = router;
