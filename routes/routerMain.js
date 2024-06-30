const express = require('express')
const routerM = express.Router()
const Main = require('../Controllers/ControllersMain/MainC')
const verifyToken = require('../Controllers/Validators/authsession') 

//pagina principal
routerM.get('/',verifyToken.verifyTokenUnLoged,Main.index);
//pagina de login
routerM.get('/Iniciar_sesion',verifyToken.verifyTokenUnLoged,Main.VistaLogin);
//logeo de usuario
routerM.post('/login',verifyToken.verifyTokenUnLoged,Main.Login);
//Pagina de eleccionde registro
routerM.get('/EleccionRegistro', verifyToken.verifyTokenUnLoged ,Main.VistaEleccionRegistro);
//ruta de logOut
routerM.get('/LogOut',verifyToken.verifyTokenLoged,Main.LogOut);


module.exports = routerM