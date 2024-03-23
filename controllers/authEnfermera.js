const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const {promisify} = require('util')

//procedimiento para registrarnos
exports.registerenfermera = async (req, res)=>{    
    try {

        const nombres = req.body.nom
        const correo = req.body.cor
        const pass = req.body.pass
        const tell = req.body.tel
        const vali = false
        const rfcs   = req.body.rfc
        const referencia    =   req.body.ref
        const apellidoPaterno   =   req.body.appat
        const apellidoMaterno   =   req.body.apmat
        const colonia   =   req.body.col
        const numExterior   =   req.body.nue
        const numInterior   =   req.body.nui
        const calle   =   req.body.cal
        const codigoPostal   =   req.body.cp
        //const comprobanteDomicilio   =   req.body.cd
        const cedulaProfesional   =   req.body.cepro
        //const tituloProfesional   =   req.body.tipro
        const aniosExperiencia = req.body.yxp
        
        let passHash = await bcryptjs.hash(pass, 8)    
        console.log(passHash)
        console.log( nombres,correo , pass ,tell ,vali ,rfcs ,referencia  ,apellidoPaterno,apellidoMaterno,colonia,numExterior ,numInterior ,calle   ,codigoPostal,aniosExperiencia,cedulaProfesional        )

        conexion.query('INSERT INTO enfermeras SET ?', {enf_val:vali, enf_nom:nombres,enf_appat:apellidoPaterno,enf_apmat:apellidoMaterno,enf_col:colonia,enf_cal:calle,enf_cp:codigoPostal,enf_int:numInterior,enf_ext:numInterior,enf_ref:referencia,enf_pas:passHash,enf_corr:correo,enf_rfc:rfcs,enf_ced:cedulaProfesional,enf_yrxp:aniosExperiencia,enf_tel:tell,enf_pas:passHash}, (error, results)=>{
            if(error){console.log(error)}
            res.redirect('/vacantes')
        })
    } catch (error) {
        console.log(error)
    }       
}

exports.login = async (req, res)=>{
    try {
        const users = req.body.user
        const passw = req.body.pass        

        if(!users || !passw ){
            res.render('login',{
                alert:true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y password",
                alertIcon:'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        }else{
            conexion.query('SELECT * FROM enfermeras WHERE enf_corr = ?', [users], async (error, results) => {
                console.log('tu error al nacer es '+error)
                if (results.length == 0 || !(await bcryptjs.compare(passw, results[0].enf_pas))) {
                    console.log(error)
                    
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o Password incorrectas",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'    
                    }
                    )
                } else {
                    console.log(users+passw)

                    //inicio de sesión OK
                    const id = results[0].id
                    const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })
                    console.log(this.login)

                    //generamos el token SIN fecha de expiracion
                   //const token = jwt.sign({id: id}, process.env.JWT_SECRETO)
                   console.log("TOKEN: "+token+" para la enfermera : "+users)

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


exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
            conexion.query('SELECT user FROM users WHERE id = ?', [decodificada.id], (error, infoe) => {
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

exports.ShowforAdmin = (req, res) => {
    conexion.query('SELECT * FROM enfermeras', function (error, listadoenf) {
        if (error) {
            console.log(error)
            return next()
            
        } else {
            listadoenf.forEach(listadoenf => {
                req.enfermeras = listadoenf
                console.log(listadoenf)
                res.render()
                
                
            })
            res.redirect('/dictamen')
        }
    })
}

exports.view = function(req, res){
    const enfermeras = conexion.query('SELECT * FROM enfermera', function(err, rows) {
      if(err) throw err;
      res.render('enfermera', {enfermeras : rows});
    });
};
  
//exports.infodpVista = function (req, res) {
    //conexion.query('SELECT * FROM enfermera', (err, rows) {
   // }}