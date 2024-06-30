const conexionU = require('../database/db');
const { promisify } = require('util');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken');
const e = require('express');
//const cloudController = require("./cloudController");
const query = promisify(conexionU.query).bind(conexionU);


/////////////////////////////////////vistas principal/////////////////////////////////////////
exports.index = (req, res) => {
    res.render('index');
}
/////////////////////////////////////Eleccion de Registro/////////////////////////////////////////

exports.VistaEleccionRegistro = async (req, res) => {
    res.render('Landing/EleccionRegistro')
}

/////////////////////////////////////login para cualquier usuario/////////////////////////////////////////
exports.VistaLogin = async (req, res) => {
    res.render('Landing/Login',{alert: false})
}

exports.Login = async (req, res) => {
    const {email, password} = req.body;
    if(email && password){
        const user = await query('SELECT * FROM datos_acceso WHERE cor_datacc = ?',[email]);
        console.log(user)
        if(user.length > 0){
            const pass = await bcryptjs.compare(password, user[0].pas_datacc);
            if(pass){
                const userEmail = user[0].cor_datacc;
                const Id_acc = user[0].id_datacc;
                const rol_acc = user[0].rol_datacc;

                if(rol_acc == 'Cliente'){
                    //obtenemos los datos del cliente
                    const userClient = await query('SELECT * FROM user WHERE id_datacc = ?', [Id_acc]);
                    const id_user = userClient[0].id_us;
                    const nom_user = userClient[0].nom_us;
                    console.log(id_user )
                    const token = jwt.sign({
                        id_datacc: Id_acc,
                        id_us: id_user,
                        nom_us: nom_user,
                        cor_datacc: userEmail,
                        rol: rol_acc
                    }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    });
                    const cookieOptions = {
                        expires: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                        ),
                        httpOnly: true
                    }
                    res.cookie('jwt', token, cookieOptions);
                    //aun no hay donde redirigir
                    console.log('entro a cliente')
                    res.redirect('/Tablero')////////////
                }else{
                    //obtenemos los datos del empleado
                    const userEmployee = await query('SELECT * FROM empleado WHERE id_datacc = ?',[Id_acc]);
                    const nom_user = userEmployee[0].nom_emp;
                    const est_user = userEmployee[0].est_emp;
                    const token = jwt.sign({id_datacc: Id_acc, nom_us: nom_user, cor_datacc: userEmail, rol: rol_acc, estado:est_user}, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    });
                    const cookieOptions = {
                        expires: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                        ),
                        httpOnly: true
                    }
                    res.cookie('jwt', token, cookieOptions);
                    //aun no hay donde redirigir
                    if(rol_acc == 'Enfermero'){
                        res.redirect('/MenuEmpleado')
                    }else if(rol_acc == 'Cuidador'){
                        res.redirect('/MenuEmpleado')
                    }
                }
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


/////////////////////////////////////Logout para cualquier usuario/////////////////////////////////////////
exports.LogOut = async (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/')
}





