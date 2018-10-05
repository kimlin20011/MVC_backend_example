const config = require('../../config/development_config');
const db = require('../connection_db');
const transporter = require('../connection_mail');

module.exports = function orderComplelte(orderID, memberID){
	let result= {};
	return new Promise(async(resolve,reject) =>{
		//確認有這筆資料
		const hasData = await checkOrderData(orderID, memberID);;
		//確認訂單是否完成
		const hasComplete = await checkOrderComplete(orderID);

			if(hasData === false){
		    result.status = "訂單完成失敗。"
            result.err = "沒有該訂單資料！"
            reject(result)
        } else if (hasComplete === false) {
            result.status = "訂單完成失敗。"
            result.err = "該訂單已經完成。"
            reject(result)
        }else if(hasData === true && hasComplete === true){
        	// 取得order_list的table資料
        	const orderData = await getOrderData(orderID, memberID);
			// 提取商品id
        	const productID = orderData[0].product_id;

        	// 依序確認訂單中的商品是否有庫存
            for(let key in orderData){
            	const hasStock = await checkOrderStock(orderData[key].product_id, orderData[key].order_quantity);
                if (hasStock !== true) {
                    result.status = "訂單完成失敗。"
                    result.err = hasStock
                    reject(result);
                    return;
                }
            }
                // 將商品庫存扣除
            await db.query('UPDATE product, order_list SET product.quantity = product.quantity - order_list.order_quantity WHERE order_list.product_id = product.id and order_list.order_id = ?;', orderID, function (err, rows) {
                if (err) {
                    console.log(err);
                    result.status = "訂單完成失敗。"
                    result.err = "伺服器錯誤，請稍後在試！"
                    reject(result);
                    return;
                }
            })

            // 將is_complete的訂單狀態改為1
            await db.query('UPDATE order_list SET is_complete = 1 WHERE order_id = ?', orderID, function (err, rows) {
                if (err) {
                    console.log(err);
                    result.status = "訂單完成失敗。"
                    result.err = "伺服器錯誤，請稍後在試！"
                    reject(result);
                    return;
                }
            })

            // 寄送Email通知

            const memberData = await getMemberData(memberID);

            const mailOptions = {
                from: `"企鵝購物網" <${config.senderMail.user}>`, // 寄信
                to: memberData.email, // 收信
                subject: memberData.name + '您好，您所購買的訂單已經完成。',  // 主旨
                html: `<p>Hi, ${memberData.name} </p>` + `<br>` + `<br>` + `<span>感謝您訂購<b>企鵝購物網</b>的商品，歡迎下次再來！</span>` // 內文
            }

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    return console.log(err);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            })

            result.status = "訂單編號：" + orderID + " 付款已完成，謝謝您使用該服務！詳細的訂單資訊已寄送至 " + memberData.email;
            resolve(result);
 

        }
	})


}

const checkOrderData = (orderID, memberID) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM order_list WHERE order_id = ? AND member_id = ? ', [orderID, memberID], function (err, rows) {
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
                console.log(rows)
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
}


const getOrderData = (orderID, memberID) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM order_list WHERE order_id = ? AND member_id = ? ', [orderID, memberID], function (err, rows) {
            resolve(rows);
        })
    })
}

const checkOrderStock = (orderProductID, orderQuantity) => {
    return new Promise((resolve, rejct) => {
        db.query('SELECT * FROM product WHERE id = ?', orderProductID, function (err, rows) {
            if (rows[0].quantity >= orderQuantity && rows[0].quantity !== 0) {
                resolve(true)
            } else {
                resolve(rows[0].name + "庫存不足")
            }
        })
    })
}


const getMemberData = function (memberID) {
  //  memberID = 1;
    let memberData = {};

    return new Promise((resolve, reject) => {
        db.query('select * from member where id = ?', memberID, function(err, rows) {
            memberData.email = rows[0].email;
            memberData.name = rows[0].name;
            resolve(memberData);
        })
    })
}