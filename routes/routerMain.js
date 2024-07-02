const express = require('express')
const routerM = express.Router()
const Main = require('../Controllers/ControllersMain/MainC')
const verifyToken = require('../Controllers/Validators/authsession') 
const ticketController = require('../Controllers/Soporte/Tickets');

//pagina principal
routerM.get('/',verifyToken.verifyTokenUnLoged,Main.index);
//pagina de login
routerM.get('/Iniciar_sesion',verifyToken.verifyTokenUnLoged,Main.VistaLogin);
//logeo de usuario
routerM.post('/login',verifyToken.verifyTokenUnLoged,Main.Login);
//Pagina de eleccionde registro
routerM.get('/EleccionRegistro', verifyToken.verifyTokenUnLoged ,Main.VistaEleccionRegistro);
//ruta de logOut
routerM.get('/LogOut', verifyToken.verifyTokenLoged, Main.LogOut);

routerM.get('/ticket', (req, res)=>{
    res.render('./tick', {alert:false})
})




module.exports = routerM