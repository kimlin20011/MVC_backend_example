const config = require('../config/development_config');
const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
	service:'gmail',
	auth:{
        user: config.senderMail.user, //gmail account
        pass: config.senderMail.password //gmail password
	}
})

//寄件的部分功能會一並寫在確認訂單部分的實作中