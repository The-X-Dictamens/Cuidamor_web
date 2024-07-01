const express = require('express')
const routerE = express.Router()
const empleado = require('../Controllers/ControllerEmpleado/empleadoController')
const verifyToken = require('../Controllers/Validators/authsession')
const testPsyco = require('../Controllers/ControllerEmpleado/TestPsycometricController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage()});

//view registro de empleado
routerE.get('/RegistroEmpleado',verifyToken.verifyTokenUnLoged,empleado.VistaRegistroEmpleado);
//registro de empleado
routerE.post('/AuthRegistrarEmpleado',verifyToken.verifyTokenUnLoged,empleado.AuthRegitrarEmpleado);
//view advertencia de registro de empleado
routerE.get('/AdvLogeoEmpleado',verifyToken.verifyTokenUnLoged,empleado.VistaAdvLogeoEmpleado);
//view para prosegir el registro de empleado
routerE.get('/validacionEmpleado',verifyToken.verifyTokenLogedEmployeeInvalid,empleado.VistaValidacionEmpleado);
//registro de documentos de empleado
routerE.post('/AuthEnviarDocuemntos',verifyToken.verifyTokenLogedEmployeeInvalid,upload.fields([{name: 'cedula',},{name: 'fotografia'},{name:'certificados'},{name:'comprobanteDomicilio'},{name:'ine'}]),empleado.AuthSubirDocumentos);
//ruta para la visualizacu¿ion de el test psicometrico
routerE.get('/TestPsicometrico',verifyToken.verifyTokenLogedEmployeeInvalid,testPsyco.getfirstPrueba);
//ruta de obtencion de resultados de test psicometrico
routerE.post('/AuthTestPsicometrico',verifyToken.verifyTokenLogedEmployeeInvalid,testPsyco.postPrueba);


//view de trabajo actual de empleado
routerE.get('/MenuEmpleado',verifyToken.verifyTokenLogedEmployee,empleado.VistaMiTrabajoActual);
//view de vacantes disponibles
routerE.get('/Vacantes',verifyToken.verifyTokenLogedEmployee,empleado.VistaVacantes);
//view de trabajos anteriores
routerE.get('/TrabajosAnteriores',verifyToken.verifyTokenLogedEmployee,empleado.VistaTrabajosAnteriores);

//view de configuracion de cuenta
routerE.get('/ConfiguracionDeCuneta',verifyToken.verifyTokenLogedEmployee,empleado.VistaConfiguracionCuenta);


module.exports = routerE
