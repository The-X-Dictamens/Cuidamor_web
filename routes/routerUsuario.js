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


routerU.post('/registerU', MetodoJ.registrarUsuario)

routerU.post('/crearUsuario', upload.fields([{name: 'comprobante_domicilio'}, { name: 'foto' }]), MetodoJ.crearUsuario);




module.exports = routerU