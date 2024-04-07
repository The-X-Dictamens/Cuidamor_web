const express = require('express')
const router = express.Router()
const metodosEnfermeras = require('../controllers_Acces/authEnfermera')

const admin = require('../controllers_Acces/authAdmin')

const metodosusers= require('../controllers_Acces/AuthUsers')


const conexion = require('../database/db')

//const authController = require('../controllers/authController')

//router para las vistas

router.get('/', (req, res)=>{
    res.render('index', )
})
router.get('/registere', (req, res)=>{    
    res.render('registro_enfemera', { user: req.user })
    
    //router.get('/', authController.isAuthenticated, (req, res)=>{    
   //     res.render('index', {user:req.user})
})

//aqui manejam,os para que se pueda redireccionar

//condicones
router.get('/condici', (req, res)=>{
    res.render('condiciones', {alert:false})
})

router.get('/registroenfermer', (req, res)=>{
    res.render('registro_enfemera' )
})

router.get('/vacantes',metodosEnfermeras.isAuthenticated, (req, res)=>{
    res.render('vacante', {alert:false})
})

router.get('/loginEnfermera',  (req, res)=>{
    res.render('login', {alert:false})
})
router.get('/dictamen', (req, res) => {
    
    conexion.query('select * from enfermeras ', (error, results) => {
        if (error) {
            throw error;
            
        } else {
            res.render('admin', { variableEnfereras: results });
        }
    })
})

router.get('/landin', (req, res)=>{
    res.render('index', {alert:false})
})

router.get('/enfermerasrevisar',(req, res)=>{
    res.render('perfil_enfermera', {alert:false})
})

//router para las vistas
//router.get('/', authController.isAuthenticated, (req, res)=>{    
  //  res.render('index', {user:req.user})
//})



router.get('/chambitas',metodosEnfermeras.isAuthenticated, (req, res)=>{
    res.render('vacantes', {alert:false})
})

router.get('/RegistroU', (req, res)=>{
    res.render('RegistroUsuarion')
})

router.get('/LoginU', (req, res)=>{
    res.render('LoginUsuarion', {alert:false})
})

router.get('/r', (req, res)=>{
    res.render('registro', {alert:false})
})
/*
router.get('/', (req, res)=>{
    res.render('', {alert:false})
})

router.get('/', (req, res)=>{
    res.render('', {alert:false})
})

router.get('/', (req, res)=>{
    res.render('', {alert:false})
})

router.get('/', (req, res)=>{
    res.render('', {alert:false})
})

router.get('/', (req, res)=>{
    res.render('', {alert:false})
})

router.get('/', (req, res)=>{
    res.render('', {alert:false})
})

router.get('/', (req, res)=>{
    res.render('', {alert:false})
})

router.get('/', (req, res)=>{
    res.render('', {alert:false})
})

router.get('/', (req, res)=>{
    res.render('', {alert:false})
})

router.get('/', (req, res)=>{
    res.render('', {alert:false})
})

router.get('/', (req, res)=>{
    res.render('', {alert:false})
})

router.get('/', (req, res)=>{
    res.render('', {alert:false})
})

router.get('/', (req, res)=>{
    res.render('', {alert:false})
})
*/





//router para los métodos del controller
router.post('/register', metodosEnfermeras.registerenfermera)
router.post('/login', metodosEnfermeras.login)
router.get('/logout', metodosEnfermeras.logout)

//admin
router.post('/AdminL', admin.login)

router.get('/enfermera', metodosEnfermeras.view);


//Metodos Usuario N ormal
router.post('/registerU', metodosusers.registerUsu)
router.post('/loginU', metodosEnfermeras.login)


module.exports = router