const db = require('../connection_db');

module.exports = function getAllOrderData() {
    let result = {};
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM order_list', function (err, rows) {
            // 若資料庫部分出現問題，則回傳「伺服器錯誤，請稍後再試！」的結果。
            if (err) {
                console.log(err);
                result.status = "取得全部訂單資料失敗。"
                result.err = "伺服器錯誤，請稍後在試！"
                reject(result);
                return;
            }
            // 若資料庫部分沒問題，則回傳全部訂單資料。
            resolve(rows);
        })
    })
}