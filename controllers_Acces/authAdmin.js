const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db');
const {promisify} = require('util')


exports.login = async (req, res) => {
    try {
        const userA = req.body.user
        const passA = req.body.pass        

        if(!userA || !passA ){
            res.render('dictamen',{
                alert:true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y password",
                alertIcon:'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'admin'
            })
        }else{
            conexion.query('SELECT * FROM users WHERE user = ? & user_rol = 99', [userA], async (error, infoe)=>{
                if( infoe.length == 0 || ! (await bcryptjs.compare(passA, infoe[0].pass)) ){
                    res.render('admin', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o Password incorrectas",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'admin'    
                    })
                }else{
                    //inicio de sesión OK
                    const id = infoe[0].id
                    const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })
                    //generamos el token SIN fecha de expiracion
                   //const token = jwt.sign({id: id}, process.env.JWT_SECRETO)
                   console.log("TOKEN: "+token+" para el Admin : "+userA)

                   const cookiesOptions = {
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                   }
                   res.cookie('jwt', token, cookiesOptions)
                   res.render('vacantes', {
                        alert: true,
                        alertTitle: "Conexión exitosa",
                        alertMessage: "¡LOGIN CORRECTO!",
                        alertIcon:'success',
                        showConfirmButton: false,
                        timer: 800,
                        ruta: 'vacantes'
                   })
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}

exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
            conexion.query('SELECT user FROM admin WHERE adm_id = ?', [decodificada.id], (error, infoe) => {
                if (error) {
                    console.log(error);
                    return next();
                }
                if (infoe && infoe.length > 0) {
                    req.user = infoe[0].user
                }
                return next();
            });
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        res.redirect('/login')
    }
}


exports.logout = (req, res)=>{
    res.clearCookie('jwt')   
    return res.redirect('/')
}

//deberia ser desde aqui que me encargo de agregar este registro al la bsae de datos? o lo hago desde la parte del usuario

//este perre para que lo quiero

/**
 * para que consulte y pueda editar todooo?
 * 
 * o que solo pueda editar cosas del trabajo, pero pues nuevamente para que,
 * no , el admin sera de la empresa, sera el que consulte los documentos de la 
 * enfermera, el que la verifique, segun yo hasta ahi era lo que habiamos planeado
 * 
 * que el tambien pueda agregar pero de igual forma podemos usar sus metodos
 *  
 * */