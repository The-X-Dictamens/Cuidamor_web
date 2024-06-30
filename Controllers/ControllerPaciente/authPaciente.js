const conexionU = require('../database/db');
const { promisify } = require('util');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const query = promisify(conexionU.query).bind(conexionU);

// Convierte la función query en una función que devuelve una promesa
const queryAsync = promisify(conexionU.query).bind(conexionU);

//Funcion para la vista de registro de pacientes

exports.VistaRegistroPaciente = async (req, res) => {
    res.render('./Usuario/RegistrarFamiliarU');
};

exports.registrarPac = async (req, res) => {

    const token = req.cookies.jwt;
    if (!token) {
        console.log('no token')
        return res.status(403).redirect('/Iniciar_sesion'); 
    }
    const cookieusuarioDeco = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);


    
    const idUs = cookieusuarioDeco.id_us;


        try {
            console.log('entro a insertar')
            //obtencion de los datos del formulario
            let { nombre, apellido_paterno, apellido_materno, fotoPa, medicam, descrip, tratami, receta } = req.body;
         
            let hm = await query("INSERT INTO historial_medico (med_hm, des_hm, trat_hm, rec_hm) VALUES (?,?,?,?)", [medicam, descrip, tratami, receta]);
            let idh = hm.insertId;

            let P = await query("INSERT INTO paciente (nom_pac, pat_pac, mat_pac, fot_pac, id_hm,id_us) VALUES (?,?,?,'N/A',?,?)", [nombre, apellido_paterno, apellido_materno, idh, idUs]);
            let idpac = P.insertId;


            //redireccion a la pagina de empleados en proceso
            res.redirect("/Tablero");
            

        } catch (err) {
            console.error(err);
            console.log('np')
        }
        
      
};

exports.mostrarPac = async (req, res, next) => {
    idUs = req.cookies.id_us
    // Haz una consulta a la base de datos para obtener los pacientes que tienen el ID de usuario dado
    let pacientes = await promisify(conexionU.query).bind(conexionU)(
        "SELECT * FROM paciente WHERE id_us = ?",
        [idUs]
    );

    // Si pacientes no es un array, conviértelo en un array
    if (!Array.isArray(pacientes)) {
        pacientes = [pacientes];
    }

    // Adjunta los pacientes a la solicitud para que estén disponibles en la siguiente función middleware
    req.pacientes = pacientes;
    console.log(pacientes);
    console.log(Array.isArray(pacientes)); // Debería imprimir 'true'
console.log(pacientes.length);
    // Llama a next() para pasar el control a la siguiente función middleware
  
    next();
};

//aqui la query dell loco del juan para mostrar la info detallada

