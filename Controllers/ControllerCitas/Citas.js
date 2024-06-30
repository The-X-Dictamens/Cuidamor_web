const conexionU = require('../database/db');
const { promisify } = require('util');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const query = promisify(conexionU.query).bind(conexionU);

exports.PostularVacantes1 = async (req, res) => {
    
    try {
        const { paciente, TipoS, DI, DF, HI, HF, descripSoli, dias } = req.body;
        descripSolici = req.body.descripSoli;
        console.log(descripSolici)
    console.log(req.body)
    idUs = req.user.id_us

        //let idDi = await query("SELECT id_dir FROM datos_acceso WHERE id_us = ?", [idUs]);
        
        
    let InsHora = await query("INSERT INTO horario (fecini_hor,fecfin_hor) VALUES (?,?)", [DI, DF]);
    console.log('si no salio mal aqui inicio ')
    console.log('si no salio mal aqui salio ' + InsHora)
    let idHor = InsHora.insertId;
        
    let diasStr = dias.join(','); // Join the array into a string

    let InsClock = await query("INSERT INTO dia_horario (horini_dh , horfin_dh, dia_dh, id_hor) VALUES (?,?,?,?)", [HI,HF,diasStr,idHor]);
        console.log('si se  insertaron los dias '+InsClock)
    // Insertar la solicitud y obtener el ID de la solicitud insertada
    let solicitud = await query("INSERT INTO solicitud (des_sol, tipo_sol, est_sol, cost_sol, id_hor, id_us, id_pac, id_emp,id_dir) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)", [descripSoli, TipoS, 'Espera', 5, idHor, idUs, paciente, null,1]);
        let idSolicitud = solicitud.insertId;


    res.redirect('/Tablero');  
    } catch (error) {
        console.log('chin, reprobaste orientacion porque '+error)
    }

    
};

/**
 * mostrar Citas
 */
exports.mostraCitas = async (req, res, next) => {
    idUs = req.userData.id_us
    // Haz una consulta a la base de datos para obtener los citras que tienen el ID de usuario dado
    let citas = await promisify(conexion.query).bind(conexion)(
        "SELECT * FROM solicitud WHERE id_us = ?",
        [idUs]
    );
    let idHor = citas[0].id_hor;
    let idPac = citas[0].id_pac;
    let idEmp = citas[0].id_emp;



    // Si pacientes no es un array, conviértelo en un array
    if (!Array.isArray(citas)) {
        citasArr = [citas];
    }

    // Adjunta los pacientes a la solicitud para que estén disponibles en la siguiente función middleware
    req.citasArr = citas;

    // Llama a next() para pasar el control a la siguiente función middleware
  
    next();
};