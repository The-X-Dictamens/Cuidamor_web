const mysql = require('mysql2')
const fs = require('fs')

const conexionEmpresa = mysql.createConnection({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSw,

    database: process.env.DB_DATABASE,

    port: process.env.DB_PORT,

    ssl:{ca:fs.readFileSync(__dirname + '/../../env/DigiCertGlobalRootCA.crt.pem'), rejectUnauthorized: false},
    
})

conexionEmpresa.connect( (error) => {
    if (error) {
        console.log(`Error de coneccion a la base de datos \nStatus de ${error}`)
        return

    }
    console.log('Conexión a la base de datos exitosa')
})




module.exports = conexionEmpresa