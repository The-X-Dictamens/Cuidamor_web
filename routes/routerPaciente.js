const express = require('express')
const routerP = express.Router()
const MetodoP = require('../controllers_Acces/authPaciente')

routerP.post('/registerF', MetodoP.registrarPac);

module.exports = routerP