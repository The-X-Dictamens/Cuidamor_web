const conexionU = require('../database/db');
const { promisify } = require('util');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken');
const e = require('express');
//const cloudController = require("./cloudController");
const query = promisify(conexionU.query).bind(conexionU);
const validacion = require('../Validators/Validator')


/////////////////////////Mostrar apartado de registro de cliente/////////////////////////////
exports.VistaRegistroEmpleado = (req, res)=>{
    if(req.cookies.jwt){
        //ruta que redirecciona a otra dependiendo de su rol
        res.redirect('/redirect')
    }else{
        res.render('Empleado/adviceLogeo',{alert: false})
    }
}

/////////////////////////Advertencia de segundo paso de registro de empleado/////////////////////////////
exports.VistaAdvLogeoEmpleado = (req, res)=>{
    if(req.cookies.jwt){
        //ruta que redirecciona a otra dependiendo de su rol
        res.redirect('/redirect')
    }else{
        res.render('Empleado/adviceLogeo',{alert: false})
    }

}


/////////////////////////Registro de empleado en la base de datos/////////////////////////////
exports.AuthRegitrarEmpleado = async (req, res) => {
    if(req.cookies.jwt){
        //ruta que redirecciona a otra dependiendo de su rol
        res.redirect('/redirect')
    }else{
        const {nombre, apellidoMaterno, apellidoPaterno, rol ,telefono, correo, contrasena, confirmarContrasena, calle, numeroExterior, numeroInterior, colonia, delegacion, codigoPostal} = req.body;
        const valid = validacion.ValidacionRegistroEmpleado(nombre, apellidoMaterno, apellidoPaterno, rol , telefono, correo, contrasena, confirmarContrasena, calle, numeroExterior, numeroInterior, colonia, delegacion, codigoPostal);
        if(!valid.valid){
            console.log(req.body)
            // Verificar si el correo ya está registrado
            const correoRegistrado = await query('SELECT * FROM datos_acceso WHERE cor_datacc = ?', [correo]);
            if(correoRegistrado.length > 0){
                res.status(400).json({message: 'correo'});
            }
            else{
                // Encriptar contraseña
                const passwordHash = await bcryptjs.hash(contrasena, 8);
                // Insertar datos en la base de datos
                let datacces = await query('INSERT INTO datos_acceso (cor_datacc, pas_datacc, rol_datacc) VALUES (?, ?, ?)', [correo, passwordHash, rol]);
                let datdireccion = await query('INSERT INTO datos_direccion (calle_dir, del_dir, numExt_dir, numInt_dir, col_dir, cp_datdir, ref_dir) VALUES (?, ?, ?, ?, ?, ?)', [calle, delegacion, numeroExterior, numeroInterior, colonia, codigoPostal, null]);
                let datempleado = await query('INSERT INTO empleado (nom_emp, pat_emp, mat_emp, fot_emp, tel_emp, est_emp, id_datacc, id_dir) VALUES (?, ?, ?, ?, ?, ?)', [nombre, apellidoPaterno, apellidoMaterno , null , telefono, 'Proceso' , datacces.insertId, datdireccion.insertId]);
                res.status(200).json({message: 'success'});
            }
        }else{
            res.status(400).json({message: 'Algunos campos son inválidos.'});
        }
    }
}



