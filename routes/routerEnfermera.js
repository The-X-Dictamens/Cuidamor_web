const express = require('express')
const routerE = express.Router()
const metodosEnfermeras = require('../controllers_Acces/authEnfermera')
//Registro
routerE.get('/Registrarme_como_enfermera', (req, res) => {
    console.log('aqui pensando')
    console.time()
    res.render('./Enfermera/RegisterE', {alert:false})
})
//Login
routerE.get('/Iniciar_sesion_enfermera', (req, res)=>{
    res.render('./Enfermera/LoginE', {alert:false})
})
//Vacantes
routerE.get('/Visualizar_vacantes', (req, res)=>{
    res.render('./Enfermera/VacantesE', {alert:false})
})
//Info Vacante
routerE.get('/Informacion_detallada_vacante', (req, res)=>{
    res.render('./Enfermera/InfoVacanteE',)
})

//Despues del registro
routerE.get('/postRegistro', (req, res)=>{
    res.render('./Enfermera/registrada',)
})
//sin Verificar
/**
 * routerE.get('/', (req, res)=>{
    res.render('./Enfermera/ViewwithoutVerify', {alert:false})
})
//Su Informacion
routerE.get('/Informacion_personal' , (req, res)=>{
    res.render('./Enfermera/InfoE', )
})
 */

//metodos a usar
routerE.post('/registerEn', metodosEnfermeras.registrarUsuario)

routerE.post('/IniciarSesionE', metodosEnfermeras.IniciarSesionEnfermeras)


module.exports = routerE