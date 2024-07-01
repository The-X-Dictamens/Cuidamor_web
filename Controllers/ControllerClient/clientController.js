const conexionU = require('../database/db');
const { promisify } = require('util');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken');
const e = require('express');
//const cloudController = require("./cloudController");
const query = promisify(conexionU.query).bind(conexionU);
const validacion = require('../Validators/Validator')


/////////////////////////Mostrar apartado de registro de cliente/////////////////////////////

exports.VistaRegistroCliente = (req, res)=>{
   res.render('Cliente/RegistroCliente',{alert: false})
}
/////////////////////////Registro de cliente en la base de datos/////////////////////////////
exports.AuthRegistroCliente = async (req, res) => {
    
    const {nombre, apellidoMaterno, apellidoPaterno, telefono, correo, contrasena, confirmarContrasena} = req.body;
    let resultValid = validacion.ValidacionRegistroCliente(nombre, apellidoMaterno, apellidoPaterno, telefono, correo, contrasena, confirmarContrasena)
    if(resultValid.valid){
        const user = await query('SELECT * FROM datos_acceso WHERE cor_datacc = ?',[correo]);
        if(user.length > 0){
            res.render('Cliente/RegistroCliente',{alert: true, title:"Error", text: "El correo ya esta registrado" , icon: "Error"})
        }else{
            const passwordHash = await bcryptjs.hash(contrasena, 8);
            //incercion de los datos en la base de datos
            let dataAcces = await query("INSERT INTO datos_acceso (cor_datacc,pas_datacc, rol_datacc) VALUES (?,?,'Cliente')", [correo,passwordHash]);
            let idDataAcces = dataAcces.insertId;
            let U = await query("INSERT INTO user (nom_us, pat_us, mat_us, fot_us, tel_us, id_datacc) VALUES (?,?,?,'N/A',?,?)", [nombre, apellidoPaterno, apellidoMaterno, telefono, idDataAcces]);
            res.redirect('/Iniciar_sesion')
        }
    }else{
        res.render('Cliente/RegistroCliente',{alert: true, title:"Error", text: resultValid.messages , icon: "Error"})
    }
    
}

exports.AuthRegitrarDomicilioUser = async (req, res) => {
    
    const { calle, numeroExterior, numeroInterior, colonia, delegacion, codigoPostal } = req.body;
    const valid = validacion.ValidacionRegistroEmpleado(calle, numeroExterior, numeroInterior, colonia, delegacion, codigoPostal);
    if (!valid.valid) {
        try {
            id_user = req.userData.id_us;
            console.log(req.body)
            // Insertar datos en la base de datos
            let datdireccion = await query('INSERT INTO direccion (calle_dir, del_dir, numExt_dir, numInt_dir, col_dir, cp_dir, ref_dir) VALUES (?, ?, ?, ?, ?, ?, ?)', [calle, delegacion, numeroExterior, numeroInterior, colonia, codigoPostal, null]);
            let id_dir = datdireccion.insertId;

            let datempleado = await query('UPDATE INTO user SET id_dir ? WHERE id_us = ?', [id_dir, id_user]);
            res.status(200).redirect('/Iniciar_sesion');
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error en el servidor.' });
        }
    } else {
        res.status(400).json({ message: 'Algunos campos son inválidos.' });
    }
}


