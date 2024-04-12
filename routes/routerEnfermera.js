const express = require('express')
const routerE = express.Router()

//Registro
routerE.get('/Registrarme_como_enfermera', (req, res)=>{
    res.render('./Enfermera/RegisterE', {alert:false})
})
//Login
routerE.get('/Iniciar_sesion_enfermera', (req, res)=>{
    res.render('./Enfermera/LoginE', {alert:false})
})
//Vacantes
routerE.get('/Visualizar_vacantes', (req, res)=>{
    res.render('./Enfermera/Vacantes', {alert:false})
})
//Info Vacante
routerE.get('/Informacion_detallada_vacante', (req, res)=>{
    res.render('./Enfermera/InfoVacanteE',)
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

module.exports = routerE