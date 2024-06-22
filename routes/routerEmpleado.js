const express = require('express')
const routerE = express.Router()
const empleado = require('../Controllers/ControllerEmpleado/EmpleadoController')

//view registro de empleado
routerE.get('/RegistroEmpleado',empleado.VistaRegistroEmpleado);
//registro de empleado
routerE.post('/AuthRegistrarEmpleado',empleado.AuthRegitrarEmpleado);


module.exports = routerE
