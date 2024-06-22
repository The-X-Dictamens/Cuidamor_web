const conexionU = require('../database/db');
const { promisify } = require('util');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const query = promisify(conexionU.query).bind(conexionU);

/**
 * Pues aqui pondremos los valores para que puedamos crear una vacante
 * ocupamos
 * id_direccion
 * id_usuario
 * id_usuario Enfermera
 * id_pac
 * id_sol
 * id_horario
 * id_dh
 * 
 * la tabla tiene 
 * id_sol` INT NOT NULL AUTO_INCREMENT,
  `des_sol` VARCHAR(500) NULL,
  `tipo_sol` ENUM('cuid', 'enfe') NULL,
  `est_sol` ENUM('Espera', 'Curso', 'Final') ,
  `cost_sol` DECIMAL(7,2) NULL,
  `id_hor` INT NOT NULL,
  `id_us` INT NOT NULL,
  `id_pac` INT NOT NULL,
  `id_emp` INT NULL,
  `id_dir`
 * 
 */

exports.VisualizarVacantes = async (req, res) => {
    let idC = req.user.Id_user;
    let vacantes = await query('SELECT * FROM solicitud WHERE id_us = ?', [idC]);
    console.log(vacantes)
}



exports.HorarioController = async (req, res) => {
        const { fecini_hor, fecfin_hor, horarios, des_sol, tipo_sol, est_sol, cost_sol, id_us, id_pac, id_dir } = req.body;

        const connection = await promisify(conexion.getConnection).bind(conexion)();
        try {
            await promisify(connection.beginTransaction).bind(connection)();

            // Insertar el horario
            const [resultHorario] = await promisify(connection.query).bind(connection)(
                "INSERT INTO horario (fecini_hor, fecfin_hor) VALUES (?, ?)",
                [fecini_hor, fecfin_hor]
            );
            const id_hor = resultHorario.insertId;

            // Insertar los días y horas del horario
            for (let horario of horarios) {
                if (horario.horini_dh && horario.horfin_dh) {
                    await promisify(connection.query).bind(connection)(
                        "INSERT INTO dia_horario (horini_dh, horfin_dh, dia_dh, id_hor) VALUES (?, ?, ?, ?)",
                        [horario.horini_dh, horario.horfin_dh, horario.dia_dh, id_hor]
                    );
                }
            }

            // Insertar la solicitud
            await promisify(connection.query).bind(connection)(
                "INSERT INTO solicitud (des_sol, tipo_sol, est_sol, cost_sol, id_hor, id_us, id_pac, id_dir) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [des_sol, tipo_sol, est_sol, cost_sol, id_hor, id_us, id_pac, id_dir]
            );

            await promisify(connection.commit).bind(connection)();
            res.redirect('/crear-vacante');
        } catch (error) {
            await promisify(connection.rollback).bind(connection)();
            console.error(error);
            res.status(500).send('Error al insertar el horario');
        } finally {
            connection.release();
        }
}

exports.insertarCitas = (req, res) => {
    const userId = req.userId; // Asegúrate de tener el userId disponible

    const dias = ['lun', 'mar', 'mier', 'jue', 'vie', 'sab', 'dom'];

    dias.forEach(dia => {
        const datosDia = req.body[dia];
        
        if (datosDia) {
            const inicio = req.body[dia + '_inicio'];
            const fin = req.body[dia + '_fin'];
            
            const query = 'INSERT INTO citas (dia, inicio, fin, datos, userId) VALUES (?, ?, ?, ?, ?)';
            connection.query(query, [dia, inicio, fin, datosDia, userId], (error, results) => {
                if (error) {
                    console.error('Error al insertar cita:', error);
                } else {
                    console.log('Cita insertada exitosamente:', results);
                }
            });
        }
    });

    res.send('Citas insertadas');
};
//pasos para la vacante
/**
 * 1ero
 * descripcion de la solicitud
 * tipo de solicitud
 * estado de la solicitud(por defecto en espera)
 * ahora de tabla horario la fecha de inicio y fin
 * obtener ese id para insertarlo en la solicitud
 * pero a su vez la tabla dia_horario tendra
 * la hora de inicio y fin junto al dia de la semana con el id de horario
 * id del usuario con el que se esta logeado
 * id del paciente al que se le asignara la solicitud
 * id del empleado que atendera la solicitud(por defecto en ninguno)
 * 
*/

exports.PostularVacantes1 = async (req, res) => {
    try {
      const { paciente, TipoS, DI, DF, HI, HF, descripcion,dias } = req.body;
    console.log(req.body)
    idUs = req.user.id_us

        //let idDi = await query("SELECT id_dir FROM datos_acceso WHERE id_us = ?", [idUs]);
        
        
        let InsHora = await query("INSERT INTO horario (fecini_hor,fecfin_hor) VALUES (?,?)", [DI, DF]);
        if (!InsHora.insertId) {
            throw new Error('No se pudo insertar en la tabla horario');
          }
    let idHor = InsHora.insertId;
        
       
    

    let InsClock = await query("INSERT INTO dia_horario (horini_dh ,horfin_dh ,dia_dh ,id_hor) VALUES (?,?,?,?",[HI,HF,dias,idHor]);

    // Insertar la solicitud y obtener el ID de la solicitud insertada
    let solicitud = await query("INSERT INTO solicitud (des_sol, tipo_sol, est_sol, cost_sol, id_hor, id_us, id_pac, id_emp) VALUES (?, ?, ?, ?, ?, ?,?,?,?,?)", [descripcion, TipoS, 'Espera', 5,idHor,idUs,paciente,'null']);
    let idSolicitud = solicitud.insertId;


    res.send('Solicitud y citas insertadas');  
    } catch (error) {
        console.log('chin, reprobaste orientacion porque '+error)
    }

    
};

/**
 * mostrar Citas
 */
exports.mostraCitas = async (req, res, next) => {
    idUs = req.user.id_us
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