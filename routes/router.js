const express = require('express')
const router = express.Router()

//const authController = require('../controllers/authController')

//router para las vistas
router.get('/', (req, res)=>{    
    res.render('index', { user: req.user })
    
    //router.get('/', authController.isAuthenticated, (req, res)=>{    
   //     res.render('index', {user:req.user})
})

//aqui manejam,os para que se pueda redireccionar

//condicones
router.get('/condici', (req, res)=>{
    res.render('condiciones', {alert:false})
})

router.get('/registroe', (req, res)=>{
    res.render('registro_enfemera', {alert:false})
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



//router para los métodos del controller
//router.post('/register', authController.register)
//router.post('/login', authController.login)
//router.get('/logout', authController.logout)

module.exports = router