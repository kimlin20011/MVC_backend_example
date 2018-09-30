const jwt = require('jsonwebtoken');
const config = require('../../config/development_config');

//進行token認證
module.exports = function verifyToken(token) {
    let tokenResult = "";
    const time = Math.floor(Date.now() / 1000);
    return new Promise((resolve, reject) => {
        //判斷token是否正確
        if (token) {

            console.log(`token${config.serect}`);
            jwt.verify(token, `${config.serect}`, function (err, decoded) {
                if (err) {
                    tokenResult = false;
                    resolve(tokenResult);
                    //token過期判斷
                } else if (decoded.exp <= time) {
                    console.log(decoded.exp);
                    tokenResult = false;
                    resolve(tokenResult);
                    //若正確
                } else {
                    tokenResult = decoded.data
                    resolve(tokenResult);
                }
            })
        }
    });
}