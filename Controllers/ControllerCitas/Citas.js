const conexionD = require('../database/db');
const { promisify } = require('util');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const query = promisify(conexionD.query).bind(conexionD);

exports.PostularVacantes1 = async (req, res) => {
    
    try {
        const { paciente, TipoS, DI, DF, HI, HF, desc, dias,precio } = req.body;
    console.log(req.body)
        idUs = req.userData.id_us
        idDir = req.userData.id_direc
        //let idDi = await query("SELECT id_dir FROM datos_acceso WHERE id_us = ?", [idUs]);
    let InsHora = await query("INSERT INTO horario (fecini_hor,fecfin_hor) VALUES (?,?)", [DI, DF]);
    console.log('si no salio mal aqui inicio ')
    console.log('si no salio mal aqui salio ' + InsHora)
    let idHor = InsHora.insertId;
        
    let diasStr = dias.join(','); // Join the array into a string

    let InsClock = await query("INSERT INTO dia_horario (horini_dh , horfin_dh, dia_dh, id_hor) VALUES (?,?,?,?)", [HI,HF,diasStr,idHor]);
        console.log('si se  insertaron los dias '+InsClock)
    // Insertar la solicitud y obtener el ID de la solicitud insertada
    let solicitud = await query("INSERT INTO solicitud (des_sol, tipo_sol, est_sol, cost_sol, id_hor, id_us, id_pac, id_emp,id_dir) VALUES (?, ?, ?, ?, ?, ?,?, ?,?)", [desc, TipoS, 'Espera', precio, idHor, idUs, paciente, null,idDir]);
        let idSolicitud = solicitud.insertId;

    res.redirect('/Tablero');  
    } catch (error) {
        console.log('chin, reprobaste orientacion porque '+error)
    }
};
/////////////Mostrar Solicitudes Enfermeras////////////////////////
exports.getListarSolicitudesEnfermera = (req, res) => { 
    const query = `SELECT s.*,
     h.fecini_hor FROM solicitud s
    JOIN horario h ON s.id_hor = h.id_hor
     WHERE h.fecini_hor >= CURDATE() AND s.est_sol = 'Espera' AND s.tipo_sol = 'Enfermera'
     ORDER BY h.fecini_hor ASC`;
    
    conexionD.query(query, (error, results) => {
        if (error) {
            console.log(error);
            return next();
        }
        //console.log(results);
        res.render('./Enfermera/VacantesE', { solicitudes: results });
    });
}

/////////////Mostrar Solicitudes Cuidador////////////////////////
exports.getListarSolicitudesCuidador = (req, res) => { 
    const query = `SELECT s.*,
     h.fecini_hor FROM solicitud s
    JOIN horario h ON s.id_hor = h.id_hor
     WHERE h.fecini_hor >= CURDATE() AND s.est_sol = 'Espera' AND s.tipo_sol = 'Cuidador'
     ORDER BY h.fecini_hor ASC`;
    
    conexionD.query(query, (error, results) => {
        if (error) {
            console.log(error);
            return next();
        }
        //console.log(results);
        res.render('./Cuidador/VacantesC', { solicitudes: results });
    });
}

/////////////Mostrar Solicitudes Cliente////////////////////////
exports.getListarSolicitudesCliente = async(req, res) => { 
    const id_us = req.userData.id_us;
    const queryL = ` SELECT s.*, h.fecini_hor 
        FROM solicitud s
        JOIN horario h ON s.id_hor = h.id_hor
        WHERE h.fecini_hor >= CURDATE() 
          AND (s.tipo_sol = 'Cuidador' OR s.tipo_sol = 'Enfermero')
          AND s.id_us = ?
          AND (s.est_sol = 'Espera' OR s.est_sol = 'Curso' OR s.est_sol = 'Final')
        ORDER BY h.fecini_hor ASC`;
    
        try {
            const results = await query(queryL, [id_us]);
            // Dividir las solicitudes en aceptadas y en espera
        const aceptadas = results.filter(solicitud => solicitud.est_sol === 'Curso');
        const enEspera = results.filter(solicitud => solicitud.est_sol === 'Espera');
        const FinishHim = results.filter(solicitud => solicitud.est_sol === 'Final');

        
        // Renderizar la vista con las solicitudes divididas
        res.render('./Usuario/userIndex', { aceptadas, enEspera , FinishHim});;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor. porque ' +error.message });
    }
};

/////////////Mostrar Solicitudes Generico////////////////////////
exports.getListarSolicitudesGenerico = (req, res) => { 
    let tipo = req.params.tipo;////////Checar esto
    const query = `SELECT s.*,
     h.fecini_hor FROM solicitud s
    JOIN horario h ON s.id_hor = h.id_hor
     WHERE h.fecini_hor >= CURDATE() AND s.est_sol = 'Espera' AND s.tipo_sol = '?'
     ORDER BY h.fecini_hor ASC`;
    
    conexionD.query(query, (error, results) => {
        if (error) {
            console.log(error);
            return next();
        }
        //console.log(results);
        res.render('./Cuidador/VacantesC', { solicitudes: results });
    });
}


/////////////Mostrar Solicitudes Enfermera////////////////////////
exports.getSolicitudDetalleEnfermera = (req, res) => {
    const id = req.params.id;
    const query = `
        SELECT s.*, h.fecini_hor, h.fecfin_hor, dh.horini_dh, dh.horfin_dh, dh.dia_dh
        FROM solicitud s
        JOIN horario h ON s.id_hor = h.id_hor
        JOIN dia_horario dh ON h.id_hor = dh.id_hor
        WHERE s.id_sol = ?
    `;
    conexionD.query(query, [id], (error, results) => {
        if (error) {
            return res.status(500).send('Error al obtener los detalles de la solicitud: ' + error.message);
        }
        if (results.length > 0) {
            res.render('./Enfermera/InfoVacanteE', { solicitud: results[0] });
        } else {
            res.status(404).send('No se encontró la solicitud con el ID especificado.');
        }
    });
};

/////////////Mostrar Solicitudes Cuidador////////////////////////
exports.getSolicitudDetalleCuidador = (req, res) => {
    const id = req.params.id;
    const query = `
        SELECT s.*, h.fecini_hor, h.fecfin_hor, dh.horini_dh, dh.horfin_dh, dh.dia_dh
        FROM solicitud s
        JOIN horario h ON s.id_hor = h.id_hor
        JOIN dia_horario dh ON h.id_hor = dh.id_hor
        WHERE s.id_sol = ?
    `;
    conexionD.query(query, [id], (error, results) => {
        if (error) {
            return res.status(500).send('Error al obtener los detalles de la solicitud: ' + error.message);
        }
        if (results.length > 0) {
            res.render('./Cuidador/InfoVacanteC', { solicitud: results[0] });
        } else {
            res.status(404).send('No se encontró la solicitud con el ID especificado.');
        }
    });
};

/////////////Mostrar Solicitudes Cliente////////////////////////
exports.getSolicitudDetalleCliente = (req, res) => {
    const id = req.params.id;
    const query = `
        SELECT s.*, h.fecini_hor, h.fecfin_hor, dh.horini_dh, dh.horfin_dh, dh.dia_dh
        FROM solicitud s
        JOIN horario h ON s.id_hor = h.id_hor
        JOIN dia_horario dh ON h.id_hor = dh.id_hor
        WHERE s.id_sol = ?
    `;
    conexionD.query(query, [id], (error, results) => {
        if (error) {
            return res.status(500).send('Error al obtener los detalles de la solicitud: ' + error.message);
        }
        if (results.length > 0) {
            res.render('./Usuario/InfoVacanteU', { solicitud: results[0] });
        } else {
            res.status(404).send('No se encontró la solicitud con el ID especificado.');
        }
    });
};




////////////////Aceptar Solicitud Enfermera////////////////////////
exports.AceptarSolici = async (req, res) => {
    let { idSolicitud } = req.body;
    idEmpleado = req.empleado.id_emp;
    console.log(idEmpleado)

    queryAceptar = `
    UPDATE solicitud
    SET id_emp = ?, est_sol = 'Curso' WHERE id_sol = ?
    `;
    try {
        const accept = await queryAsync(queryAceptar, [idEmpleado, idSolicitud]);
        if (accept.affectedRows > 0) {
            res.redirect('/Empleado/Visualizar_vacantes');
            console.log('Solicitud aceptada');
        }else{
            console.log('Solicitud no ase pudo ceptada');
        }
    } catch (error) {
        console.log(error);
        
    }
}
 
// Muestra el formulario de edición de la solicitud
exports.formularioEditarSolicitud = async (req, res) => {
    try {
        const id = req.params.id; // Obtener el ID de la solicitud desde los parámetros de la URL
        const solicitud = await query('SELECT * FROM solicitud WHERE id_sol = ?', [id]); // Consultar la solicitud en la base de datos
        res.render('./Usuario/editarSolicitud', { solicitud: solicitud[0] }); // Renderizar la vista de edición con los datos de la solicitud
    } catch (error) {
        console.error(error); // Imprimir el error en la consola
        res.status(500).send('Error al obtener la solicitud para editar'); // Enviar una respuesta de error al cliente
    }
};

// Procesa la edición de la solicitud
exports.editarSolicitud = async (req, res) => {
    try {
        const id = req.params.id; // Obtener el ID de la solicitud desde los parámetros de la URL
        const { des_sol, tipo_sol, est_sol,  fecini_hor, fecfin_hor, horini_dh, horfin_dh, dia_dh, nom_pac } = req.body; // Obtener los datos del formulario desde el cuerpo de la solicitud
        await query('UPDATE solicitud SET des_sol = ?, tipo_sol = ?, est_sol = ?, cost_sol = ?, fecini_hor = ?, fecfin_hor = ?, horini_dh = ?, horfin_dh = ?, dia_dh = ?, nom_pac = ? WHERE id_sol = ?', 
                    [des_sol, tipo_sol, est_sol, fecini_hor, fecfin_hor, horini_dh, horfin_dh, dia_dh, nom_pac, id]); // Actualizar la solicitud en la base de datos con los nuevos datos
        res.redirect(`/solicitudes/detalle/${id}`); // Redirigir al usuario a la página de detalles de la solicitud actualizada
    } catch (error) {
        console.error(error); // Imprimir el error en la consola
        res.status(500).send('Error al editar la solicitud'); // Enviar una respuesta de error al cliente
    }
};
