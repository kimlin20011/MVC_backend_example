const db = require('../connection_db');

module.exports = function orderDelete(deleteList) {
    return new Promise(async (resolve, reject) => {
        let result = {};

        // 有幾筆資料就刪除幾次資料
        for (let key in deleteList) {
            let hasData = await checkOrderData(deleteList[key].orderID, deleteList[key].memberID, deleteList[key].productID);
            let hasComplete = await checkOrderComplete(deleteList[key].orderID, deleteList[key].memberID, deleteList[key].productID);
            if (hasData === false) {
                result.status = "刪除訂單資料失敗。"
                result.err = "找不到該筆資料。"
                reject(result);
            }
            else if (hasComplete === false) {
                result.status = "刪除訂單資料失敗。"
                result.err = "該筆資料已經完成。"
                reject(result);
            } else if (hasData === true && hasComplete === true) {
                db.query('DELETE FROM order_list WHERE order_id = ? and member_id = ? and product_id = ?', [deleteList[key].orderID, deleteList[key].memberID, deleteList[key].productID], function (err, rows) {
                    if (err) {
                        console.log(err);
                        result.err = "伺服器錯誤，請稍後在試！"
                        reject(result);
                        return;
                    }
                    result.status = "刪除訂單資料成功。";
                    result.deleteList = deleteList;
                    resolve(result);
                });
            }
        }
    })
}

const checkOrderData = function (orderID, memberID, productID) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM order_list WHERE order_id = ? AND member_id = ? AND product_id = ?', [orderID, memberID, productID], function (err, rows) {
            if (rows[0] === undefined) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
}

const checkOrderComplete = function (orderID, memberID, productID) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM order_list WHERE order_id = ? AND member_id = ? AND product_id = ? AND is_complete = 0', [orderID, memberID, productID], function (err, rows) {
            if (rows[0] === undefined) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
}