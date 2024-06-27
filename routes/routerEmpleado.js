const express = require('express')
const routerE = express.Router()
const empleado = require('../Controllers/ControllerEmpleado/empleadoController')
const verifyToken = require('../Controllers/Validators/authsession')

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


module.exports = routerE
