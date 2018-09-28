require('dotenv').config()

console.log(process.env.MY_SECRET)
module.exports ={
    mysql: {
      host: process.env.HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE
    },
    serect: process.env.MY_SECRET,
}
