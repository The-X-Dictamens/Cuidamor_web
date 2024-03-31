exports.login = async (req, res)=>{
    try {
        const users = req.body.user
        const pass = req.body.pass        

        if(!users || !pass ){
            res.render('login',{
                alert:true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y password",
                alertIcon:'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        }else{                 //         \Name Tabla  Atributo   recopilado
            conexion.query('SELECT * FROM users WHERE user = ?', [users], async (error, results)=>{
                if( results.length == 0 || ! (await bcryptjs.compare(pass, results[0].pass)) ){
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o Password incorrectas",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'    
                    })
                }else{
                    //inicio de sesión OK .loquepedimos
                    const ids = results[0].id //el :es el mio
                    const token = jwt.sign({id:ids}, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })
                    //generamos el token SIN fecha de expiracion
                   //const token = jwt.sign({id: id}, process.env.JWT_SECRETO)
                   //console.log("TOKEN: "+token+" para el USUARIO : "+users)

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
                        ruta: ''//a donde me va a llevar
                   })
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}

/**
 * esto es una prueba par poder ver que tan rapido escribe, pues claramente teiene un retraso por lo que
 * debere usar esta para ver los videps o demas cosas mientras ocupo la laptop para el programing
 */
jljjlkjjj888888888888888888889898989