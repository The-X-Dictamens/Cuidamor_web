const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const app = express()

//seteamos el motor de plantillas
app.set('view engine', 'ejs')
//seteamos la carpeta public para archivos estáticos
app.use(express.static('public'))
//para procesar datos enviados desde forms
app.use(express.urlencoded({extended:true}))
app.use(express.json())
//seteamos las variables de entorno
dotenv.config({ path: './env/.env' })
//para poder trabajar con las cookies
app.use(cookieParser())
//puesto que usaremos 
const port = process.env.PORT || 3000
/*
//esto se agregar para cachar 404
// Middleware para capturar errores 404
app.use((req, res, next) => {
    res.status(404).render('Landing/404');
  });
*/
////////////////////////En esta parta se usaran las rutas de todo//////////////////////////////////

//rutas de la pagina principal
app.use('/', require('./routes/routerMain'))
//rutas de la pagina de cliente
app.use('/', require('./routes/routerClient'))
//rutas de la pagina de empleado
app.use('/', require('./routes/routerEmpleado'))
//rutas de la pagina de usuario
app.use('/', require('./routes/routerUsuario'))

//////////////////////////////////////////////////////////////////////////////////////////////////

//iniciado el servidor
app.listen(port, ()=>{
    console.log(`SERVER UP runnung in http://localhost:${port}`)
})