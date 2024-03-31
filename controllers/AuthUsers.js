const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const {promisify} = require('util')

//procedimiento para registrarnos
exports.registerUsu = async (req, res)=>{    
    try {
        const correo = req.body.correo
        const pass = req.body.passHash
        const name = req.body.name
        const apemat = req.body.apmat
        const apepat = req.body.appat
        const telef = req.body.tel
        let passHash = await bcryptjs.hash(pass, 8)    
        //console.log(passHash)                         base de datos:mi campo
        conexion.query('INSERT INTO Usuario SET ?', {
            corr_usu: correo, pass_usu: passHash, nom_usu: name, mat_usu: apemat,
        pat_usu: apepat,  tel_usu: telef}, (error, results) => {
            if(error){console.log(error)}
            res.redirect('/RegistroUsuario')
            console.log(this.registerUsu)
        })
    } catch (error) {
        console.log(error+'error al registrar Usuarios')
    }       
}

exports.loginUser = async (req, res)=>{
    try {
        const usern = req.body.user
        const passn= req.body.pass        

        if(!usern || !passn ){
            res.render('LoginUsuarion',{
                alert:true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y password",
                alertIcon:'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'RegistroUsuarion'
            })
        }else{
            conexion.query('SELECT * FROM Usuario WHERE corr_usu = ?', [usern], async (error, results)=>{
                if( results.length == 0 || ! (await bcryptjs.compare(passn, results[0].pass_usu)) ){
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o Password incorrectas",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'LoginUsuarion'    
                    })
                }else{
                    //inicio de sesión OK
                    const id = results[0].id_usu
                    const token = jwt.sign({id_usu:id}, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })
                    console.log(this.loginUser)

                    //generamos el token SIN fecha de expiracion
                   //const token = jwt.sign({id: id}, process.env.JWT_SECRETO)
                   console.log("TOKEN: "+token+" para el USUARIO : "+usern)

                   const cookiesOptions = {
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                   }
                   res.cookie('jwt', token, cookiesOptions)
                   res.render('login', {
                        alert: true,
                        alertTitle: "Conexión exitosa",
                        alertMessage: "¡LOGIN CORRECTO!",
                        alertIcon:'success',
                        showConfirmButton: false,
                        timer: 800,
                        ruta: ''
                   })
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}

exports.isAuthenticated = async (req, res, next)=>{
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results)=>{
                if(!results){return next()}
                req.user = results[0]
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    }else{
        res.redirect('/login')        
    }
}

exports.logout = (req, res)=>{
    res.clearCookie('jwt')   
    return res.redirect('/')
}