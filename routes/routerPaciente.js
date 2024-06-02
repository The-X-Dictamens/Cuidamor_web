const express = require('express')
const routerP = express.Router()
const MetodoP = require('../controllers_Acces/authPaciente')
const MetodoJ = require('../controllers_Acces/AuthUser.js')


routerP.post('/registerF',MetodoJ.UserAuth, MetodoP.registrarPac);

module.exports = routerP