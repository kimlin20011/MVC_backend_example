var express = require('express');
var router = express.Router();

const MemberModifyMethod = require('../controllers/modify_controller');

/* GET home page. */
memberModifyMethod = new MemberModifyMethod();

router.post('/register', memberModifyMethod.postRegister);

router.post('/login', memberModifyMethod.postLogin);

module.exports = router;
