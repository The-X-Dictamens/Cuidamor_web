    const express = require('express')
const routerU = express.Router()
const MUsers = require('../Controllers/ControllerClient/clientController.js')
const VacantesM = require('../Controllers/ControllerCitas/Citas.js')
const Pacientes = require('../Controllers/ControllerPaciente/authPaciente.js')
const AuthSs = require('../Controllers/Validators/authsession.js')
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

routerU.get('/familiar',AuthSs.verifyTokenLogedClient, (req, res) => {
    res.render('./Usuario/RegistrarFamiliarU',{user: req.userData} )
})

routerU.get('/postular',AuthSs.verifyTokenLogedClient,Pacientes.mostrarPac, (req, res) => {
    res.render('./Usuario/Postular', {user: req.userData, pacientes: req.pacientes });
});

routerU.get('/Tablero', AuthSs.verifyTokenLogedClient, AuthSs.verifyTokenLogedUserDom, VacantesM.getListarSolicitudesCliente, (req, res) => {
    res.render('./Usuario/userIndex', { user: req.userData })
});


routerU.get('/Tutorial', (req, res)=>{
    res.render('./Usuario/tutorial',{user:req.userData})
})
routerU.get('/RegistroDomicilio', AuthSs.verifyTokenLoged, (req, res) => {
    res.render('./Usuario/RegistroDomicilio', { user: req.userData, alert: false });
})
//Info Vacante                                          para verificar              para checarle el permiso
routerU.get('/solicitudes/detalle/:id', VacantesM.getSolicitudDetalleCliente, (req, res) => {
    
})

// Ruta para mostrar el formulario de edición de la solicitud
routerU.get('/solicitudes/editar/:id', VacantesM.formularioEditarSolicitud);

// Ruta para procesar la edición de la solicitud
routerU.post('/solicitudes/editar/:id', VacantesM.editarSolicitud);

routerU.post('/registerF',AuthSs.verifyTokenLogedClient, Pacientes.registrarPac);


//routerU.get('/Mis_vacantes', MUsers.VisualizarVacantes)

//routerU.get('/Home', MUsers.VisualizarMenu)

routerU.post('/PostularT', AuthSs.verifyTokenLogedClient,VacantesM.PostularVacantes1)

routerU.post('/RegisterDom',AuthSs.verifyTokenLoged, MUsers.AuthRegitrarDomicilioUser)

module.exports = routerU