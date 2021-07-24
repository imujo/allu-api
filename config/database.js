const knex = require('knex')
const fs = require('fs')



require('dotenv').config()




const db = knex({
    client: 'pg',
    connection: {
        host : process.env.DATABASE_HOST,
        user : process.env.DATABASE_USERNAME,
        password : process.env.DATABASE_PASSWORD,
        database : process.env.DATABASE_NAME
    },
    // connection: {
    //     connectionString: 'postgresql://doadmin:dfmz0gbsuqedaouw@allu-database-do-user-9551667-0.b.db.ondigitalocean.com:25060/defaultdb',
    //     ssl: {
    //         rejectUnauthorized: false
    //     }
    // }

});






 db.select('*').from('users')
    .then(d=>console.log('connected'))
    .catch(e=>console.log('not connected'))


module.exports = db;