const mysql = require('mysql2')

const conexionEmpresa = mysql.createConnection({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSw,

    database: process.env.DB_DATABASE,
    

})

conexionEmpresa.connect( (error) => {
    if (error) {
        console.log('EL error esta al nacer porque: ' + error)
        return

    }
    console.log('cockNectado')
})




module.exports = conexionEmpresa