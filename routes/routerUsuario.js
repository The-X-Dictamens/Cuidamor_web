const express = require('express')
const routerU = express.Router()
const MetodoJ = require('../controllers_Acces/AuthUser.js')
const VacantesM = require('../CitasController/crearVacante.js')
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const jwt = require('jsonwebtoken');


//primero pues las que nos mandan con la landingpage

routerU.get('/', (req, res)=>{
    res.render('index', )
})

/**
 * Condiciones de uso 
 */
routerU.get('/Condiciones_de_uso', (req, res)=>{
    res.render('./Landin/condiciones', {alert:false})
})

/**
 * Condiciones de uso 
 */
routerU.get('/Registrarme', (req, res)=>{
    res.render('./Usuario/RegisterU', {alert:false})
})

routerU.get('/Iniciar_sesion', (req, res)=>{
    res.render('./Usuario/LoginU', {alert:false})
})

/**
 * Contacto
 */
routerU.get('/Informacion_de_contacto', (req, res)=>{
    res.render('./Landin/contacto', {alert:false})
})

/**
 * Politicas
 */
routerU.get('/Politicas_de_privacidad', (req, res)=>{
    res.render('./Landin/politica', {alert:false})
})

/**
 * Servicios
*/
routerU.get('/Servicios_disponibles', (req, res)=>{
    res.render('./Landin/servicios', {alert:false})
})


routerU.get('/postular', (req, res) => {
/*const token = req.cookies.jwt;
const decoded = jwt.verify(token, process.env.JWT_SECRETO);
    const userId = decoded.id_us;
    console.log(userId)
res.render('./Usuario/Postular', { userId: userId })*/
});


routerU.get('/familiar', (req, res)=>{
    res.render('./Usuario/RegistrarFamiliarU', {alert:false})
})
routerU.get('/Tablero', MetodoJ.UserAuth, MetodoJ.VisualizarVacantes);

routerU.get('/Tutorial', (req, res)=>{
    res.render('./Usuario/tutorial', {alert:false})
})



routerU.post('/registerU', MetodoJ.crearUsuario)

routerU.post('/crearUsuario', MetodoJ.crearUsuario);

routerU.post('/IniciarSesionUsuario', MetodoJ.IniciarSesionUsuario)

routerU.get('/Mis_vacantes',MetodoJ.VisualizarVacantes)

module.exports = routerU