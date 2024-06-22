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
        //ahun no hay donde redireccionar
        //res.redirect('/')
    }else{
        res.render('Empleado/RegistroEmpleado',{alert: false})
    }
}

/////////////////////////Registro de empleado en la base de datos/////////////////////////////
exports.AuthRegitrarEmpleado = async (req, res) => {
    const {nombre, apellidoMaterno, apellidoPaterno, telefono, correo, contrasena, confirmarContrasena, calle, numeroExterior, numeroInterior, colonia, delegacion, codigoPostal} = req.body;
    const valid = validacion.ValidacionRegistroEmpleado(nombre, apellidoMaterno, apellidoPaterno, telefono, correo, contrasena, confirmarContrasena, calle, numeroExterior, numeroInterior, colonia, delegacion, codigoPostal);

    console.log(req.body);
    // Verificar si el correo ya está registrado
    const correoRegistrado = await query('SELECT * FROM datos_acceso WHERE cor_datacc = ?', [correo]);
    if(correoRegistrado.length > 0){
        res.status(400).json({message: 'correo'});
    }
    else{
        // Encriptar contraseña
        const passwordHash = await bcryptjs.hash(contrasena, 8);
        // Insertar datos en la base de datos
        let datacces = await query('INSERT INTO datos_acceso (cor_datacc, pas_datacc, rol_datacc) VALUES (?, ?, ?)', [correo, passwordHash, ]);
        let datdireccion = await query('INSERT INTO datos_direccion (del_dir, col_dir, numext_dir, numint_dir, col_dir, cp_datdir) VALUES (?, ?, ?, ?, ?, ?)', [calle, numeroExterior, numeroInterior, colonia, delegacion, codigoPostal]);
        res.status(200).json({message: 'success'});
    }
}

