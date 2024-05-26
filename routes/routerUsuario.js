const express = require('express')
const routerU = express.Router()
const MetodoJ = require('../controllers_Acces/AuthUser.js')
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage()});


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



routerU.get('/familiar', (req, res)=>{
    res.render('./Usuario/RegistrarFamiliarU', {alert:false})
})
routerU.get('/VistaMU', (req, res)=>{
    res.render('./Usuario/userIndex', {alert:false})
})

routerU.get('/Tablero', (req, res)=>{
    res.render('./Usuario/Tutorial', {alert:false})
})

routerU.get('/Menu', (req, res)=>{
    res.render('./Usuario/MenuU', {alert:false})
})




routerU.post('/registerU', MetodoJ.crearUsuario)

routerU.post('/crearUsuario', MetodoJ.crearUsuario);

routerU.post('/IniciarSesionUsuario', MetodoJ.IniciarSesionUsuario)



module.exports = routerU