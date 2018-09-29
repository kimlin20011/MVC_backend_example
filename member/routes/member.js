var express = require('express');
var router = express.Router();

const MemberModifyMethod = require('../controllers/modify_controller');

/* GET home page. */
memberModifyMethod = new MemberModifyMethod();

// # Node.js-Backend見聞錄(16)：實作-會員系統(五)-添加部分功能更動成：

// 註冊新會員
router.post('/member', memberModifyMethod.postRegister);

// 會員登入
router.post('/member/login', memberModifyMethod.postLogin);

// 更新會員資料
router.put('/member', memberModifyMethod.putUpdate);

// 更新會員資料（檔案上傳示範，可直接取代/member的PUT method）
router.put('/updateimage', memberModifyMethod.putUpdateImage);

module.exports = router;
