const express = require('express')
const routerM = express.Router()
const Main = require('../Controllers/ControllersMain/MainC')

//pagina principal
routerM.get('/',Main.index);
//pagina de login
routerM.get('/Iniciar_sesion',Main.VistaLogin);
//logeo de usuario
routerM.post('/login',Main.Login);
//Pagina de eleccionde registro
routerM.get('/EleccionRegistro',Main.VistaEleccionRegistro);


module.exports = routerM