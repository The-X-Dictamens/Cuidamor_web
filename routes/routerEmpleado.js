const express = require('express')
const routerE = express.Router()
const empleado = require('../Controllers/ControllerEmpleado/empleadoController')
const verifyToken = require('../Controllers/Validators/authsession')
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage()});

//view registro de empleado
routerE.get('/RegistroEmpleado',verifyToken.verifyTokenUnLoged,empleado.VistaRegistroEmpleado);
//registro de empleado
routerE.post('/AuthRegistrarEmpleado',verifyToken.verifyTokenUnLoged,empleado.AuthRegitrarEmpleado);
//view advertencia de registro de empleado
routerE.get('/AdvLogeoEmpleado',verifyToken.verifyTokenUnLoged,empleado.VistaAdvLogeoEmpleado);
//view trabajos  de empleado
routerE.get('/MenuEmpleado',verifyToken.verifyTokenLogedEmployee,empleado.VistaMisTrabajos);
//view para prosegir el registro de empleado
routerE.get('/validacionEmpleado',verifyToken.verifyTokenLogedEmployeeInvalid,empleado.VistaValidacionEmpleado);
//registro de documentos de empleado
routerE.post('/AuthEnviarDocuemntos',verifyToken.verifyTokenLogedEmployeeInvalid,upload.fields([{name: 'cedula',},{name: 'fotografia'},{name:'certificados'},{name:'comprobanteDomicilio'},{name:'ine'}]),empleado.AuthSubirDocumentos);


module.exports = routerE
