//variables para el servidor con express
const express = require('express')
const path = require('path')
const app = express()
var router = express.Router();
const bodyParser= require('body-parser')
const cookieParser = require('cookie-parser')
//obtener el cuerpo de una petición POST "req.body"
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
// configura el motor de visualizacion ejs
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//configuracion del uso de la carpeta publica del cliente (estilos de pajina css, imagenes y scripts)
app.use(express.static('public'));
//uso de la carpeta de views para la obtencion de los archivos ejs
app.set('views', path.join(__dirname, 'views'));
//para capturar los datos del formulario
app.use(express.urlencoded({extended:false}));


//////////////////////rutas//////////////////////////
//ruta de accesos principales//
app.use('/', require('./routes/routerUsers'))








app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});


app.listen(1999, ()=>{
    console.log('SERVER UP runnung in http://localhost:1999')
})