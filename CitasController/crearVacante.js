const conexion = require('../database/db');
const { promisify } = require('util');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudController = require('./cloudController');

class HorarioController {
    async crearHorario(req, res) {
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
}

module.exports = new HorarioController();
