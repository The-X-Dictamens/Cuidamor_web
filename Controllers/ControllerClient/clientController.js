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
    if(req.cookies.jwt){
        //ahun no hay donde redireccionar
        //res.redirect('/')
    }else{
        res.render('Cliente/RegistroCliente',{alert: false})
    }
}
/////////////////////////Registro de cliente en la base de datos/////////////////////////////
exports.AuthRegistroCliente = async (req, res) => {
    if(req.cookies.jwt){
        //redireccionar dependiendo del tipo de usuario
    }else{
        const {nombre, apellidoMaterno, apellidoPaterno, telefono, correo, contrasena, confirmarContrasena} = req.body;
        let resultValid = validacion.ValidacionRegistroCliente(nombre, apellidoMaterno, apellidoPaterno, telefono, correo, contrasena, confirmarContrasena)
        if(resultValid.valid){
            const user = await query('SELECT * FROM datacc WHERE cor_datacc = ?',[correo]);
            if(user.length > 0){
                res.render('Cliente/RegistroCliente',{alert: true, title:"Error", text: "El correo ya esta registrado" , icon: "Error"})
            }else{
                const passwordHash = await bcryptjs.hash(contrasena, 8);
                //incercion de los datos en la base de datos
                let dataAcces = await query("INSERT INTO datos_acceso (cor_datacc,pas_datacc, rol_datacc) VALUES (?,?,'clie')", [correo,passwordHash]);
                let idDataAcces = dataAcces.insertId;
                let U = await query("INSERT INTO user (nom_us, pat_us, mat_us, fot_us, tel_us, id_datacc) VALUES (?,?,?,'N/A',?,?)", [nombre, apellidoPaterno, apellidoMaterno, telefono, idDataAcces]);
                res.redirect('/Login')
            }
        }else{
            res.render('Cliente/RegistroCliente',{alert: true, title:"Error", text: resultValid.messages , icon: "Error"})
        }
    }
}
