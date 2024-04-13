const mysql2 = require('mysql2');

const conexion = mysql2.createConnection({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSw,

    database: process.env.DB_DATABASE,
    
})

conexion.connect( (error) => {
    if (error) {
        console.log('Error en la coneccion. \n  status: ---' + error + '---')
        return
    }
    console.log('base de datosc conectada');
})




module.exports = conexion;