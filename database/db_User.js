const mysql = require('mysql2')

const conexionUsers = mysql.createConnection({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSw,

    database: process.env.DB_DATABASEUSER,
    

})

conexionUsers.connect( (error) => {
    if (error) {
        console.log('EL error esta al nacer porque tu base de usuarios: ' + error)
        return

    }
    console.log('cockNectado')
})




module.exports = conexionUsers