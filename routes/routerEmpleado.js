const express = require('express')
const routerE = express.Router()
const empleado = require('../Controllers/ControllerEmpleado/empleadoController')

//view registro de empleado
routerE.get('/RegistroEmpleado',empleado.VistaRegistroEmpleado);
//registro de empleado
routerE.post('/AuthRegistrarEmpleado',empleado.AuthRegitrarEmpleado);
//view advertencia de registro de empleado
routerE.get('/AdvLogeoEmpleado',empleado.VistaAdvLogeoEmpleado);


module.exports = routerE
