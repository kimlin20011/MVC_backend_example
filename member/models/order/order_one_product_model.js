const db = require('../connection_db');

module.exports = function postOneOrderData(orderOneList) {
    let result = {};
    return new Promise(async (resolve, reject) => {

        const hasData = await checkOrderData(orderOneList.orderID, orderOneList.memberID, orderOneList.productID);

        const hasComplete = await checkOrderComplete(orderOneList.orderID);

        if (hasData === true) {
            result.status = "新增單筆訂單資料失敗。"
            result.err = "已有該筆訂單資料！"
            reject(result)
        } else if (hasComplete === false){
            result.status = "新增單筆訂單資料失敗。"
            result.err = "該筆訂單已經完成。"
            reject(result)
        } else if (hasData === false) {

            const price = await getProductPrice(orderOneList.productID);

            const orderList = {
                order_id: orderOneList.orderID,
                member_id: orderOneList.memberID,
                product_id: orderOneList.productID,
                order_quantity: orderOneList.quantity,
                order_price: orderOneList.quantity * price,
                is_complete: 0,
                order_date: orderOneList.createDate
            }

            db.query('INSERT INTO order_list SET ?', orderList, function (err, rows) {
                // 若資料庫部分出現問題，則回傳「伺服器錯誤，請稍後再試！」的結果。
                if (err) {
                    console.log(err);
                    result.status = "新增單筆訂單資料失敗。"
                    result.err = "伺服器錯誤，請稍後在試！"
                    reject(result);
                    return;
                }
                result.status = "新增單筆訂單資料成功。"
                result.orderList = orderList
                resolve(result);
            })
        }
    })
}

const checkOrderData = (orderID, memberID, productID) => {
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

const checkOrderComplete = (orderID) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT is_complete FROM order_list WHERE order_id = ?', orderID, function (err, rows) {
            if (rows[0].is_complete === 1) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
}


const getProductPrice = (productID) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT price FROM product WHERE id = ?', productID, function (err, rows) {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            resolve(rows[0].price);
        })
    })
}