const express = require('express')
const routerE = express.Router()
const metodosEnfermeras = require('../Controllers/authEnfermera')
//Registro
routerE.get('/RegistrarmeE', (req, res) => {
    console.log('aqui pensando')
    console.time()
    res.render('./Enfermera/RegisterE', {alert:false})
})
//Login
routerE.get('/IniciarE', (req, res)=>{
    res.render('./Enfermera/LoginE', {alert:false})
})
//Vacantes
routerE.get('/Visualizar_vacantes',metodosEnfermeras.getListarSolicitudes, (req, res)=>{
    res.render('./Enfermera/VacantesE', {empleado: req.empleado, alert:false})
})
//Info Vacante                                          para verificar              para checarle el permiso
routerE.get('/solicitudes/detalle/:id', metodosEnfermeras.getSolicitudDetalle, (req, res)=>{
})

//Despues del registro
routerE.get('/postRegistro', (req, res)=>{
    res.render('./Enfermera/registrada',)
})
//sin Verificar
routerE.get('/noautenticado', (req, res)=>{
    res.render('./Enfermera/ViewwithoutVerify', {alert:false})
})


routerE.get('/pagina-deseada', (req, res)=>{
    res.render('./Enfermera/deseada', {alert:false})
})

/**
 * 
//Su Informacion
routerE.get('/Informacion_personal' , (req, res)=>{
    res.render('./Enfermera/InfoE', )
})
 */



//metodos a usar
routerE.post('/registerEn', metodosEnfermeras.registrarUsuario)

routerE.post('/iniciarSesionE', metodosEnfermeras.IniciarSesionEnfermeras)

routerE.post('/Aceptar', metodosEnfermeras.EnfermeraAuth,metodosEnfermeras.AceptarSolici)



module.exports = routerE