const express = require('express')
const routerC = express.Router()
const client = require('../Controllers/ControllerClient/clientController')

//view registro de cliente 
routerC.get('/RegistroCliente',client.VistaRegistroCliente);

//registro de cliente
routerC.post('/AuthRegistrarCliente',client.AuthRegistroCliente);




module.exports = routerC