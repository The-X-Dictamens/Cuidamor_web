const express = require('express')
const routerU = express.Router()
const MetodoJ = require('../controllers_Acces/AuthUser.js')
const VacantesM = require('../CitasController/crearVacante.js')
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const jwt = require('jsonwebtoken');
const { promisify } = require('util');



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


routerU.get('/postular',MetodoJ.UserAuth, (req, res) => {
res.render('./Usuario/Postular',{user:req.user} )
});


routerU.get('/familiar',MetodoJ.UserAuth, (req, res)=>{
    res.render('./Usuario/RegistrarFamiliarU',{user:req.user})
})
routerU.get('/Tablero',  MetodoJ.UserAuth, MetodoJ.VisualizarVacantes,(req, res)=>{
    console.log(req.user)
    res.render('./Usuario/userIndex',{user:req.user}
    )
})


routerU.get('/Tutorial', (req, res)=>{
    res.render('./Usuario/tutorial',{user:req.user})
})



routerU.post('/registerU', MetodoJ.crearUsuario)

routerU.post('/crearUsuario', MetodoJ.crearUsuario);

routerU.post('/IniciarSesionUsuario', MetodoJ.IniciarSesionUsuario)

routerU.get('/Mis_vacantes', MetodoJ.VisualizarVacantes)


module.exports = routerU