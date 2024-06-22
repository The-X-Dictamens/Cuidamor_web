const conexionU = require('../database/db');
const { promisify } = require('util');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken');
const e = require('express');
//const cloudController = require("./cloudController");
const query = promisify(conexionU.query).bind(conexionU);


/////////////////////////////////////vistas principal/////////////////////////////////////////
exports.index = (req, res) => {
    if(req.cookies.jwt){
        console.log(req.cookies.jwt)
        //redireccionar dependiendo del tipo de usuario
    }else{
        res.render('index',{alert: false})
    }
}
/////////////////////////////////////Eleccion de Registro/////////////////////////////////////////

exports.VistaEleccionRegistro = async (req, res) => {
    res.render('Landing/EleccionRegistro')
}

/////////////////////////////////////login para cualquier usuario/////////////////////////////////////////
exports.VistaLogin = async (req, res) => {
    if(req.cookies.jwt){
        console.log(req.cookies.jwt)
        //redireccionar dependiendo del tipo de usuario
    }else{
        res.render('Landing/Login',{alert: false})
    }
}

exports.Login = async (req, res) => {
    const {email, password} = req.body;
    if(email && password){
        const user = await query('SELECT * FROM usuarios WHERE email = ?',[email]);
        if(user.length > 0){
            const pass = await bcryptjs.compare(password, user[0].password);
            if(pass){
                // Obtener información del usuario para incluir en el token JWT
                const Id_acc = user[0].id_datacc;
                const userEmail = user[0].cor_datacc;
                const resultadosUser = await queryAsync('SELECT id_us, nom_us FROM user WHERE id_datacc = ?', [Id_acc]);
                const Id_user = resultadosUser[0].id_us;
                const nom_user = resultadosUser[0].nom_us;


                const token = jwt.sign({id_datacc: Id_acc,id_us:Id_user, nom_us: nom_user, cor_datacc: userEmail}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);
                res.redirect('/')
            }else{
                res.render('Landing/Login',{alert: true})
            }
        }else{
            res.render('Landing/Login',{alert: true})
        }
    }else{
        res.render('Landing/Login',{alert: true})
    }
}




