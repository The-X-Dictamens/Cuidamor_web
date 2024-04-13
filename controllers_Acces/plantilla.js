const conexion = require('../database/db');
const { promisify } = require('util');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Convierte la función query en una función que devuelve una promesa
const queryAsync = promisify(conexion.query).bind(conexion);

//procedimiento para registrarnos
exports.registrarUsuario = async (req, res)=>{    
    try {
        const name = req.body.name;
        const user = req.body.user;
        const pass = req.body.pass;
        const appat = req.body.appat; 
        const apmat = req.body.apmat;

        let passHash = await bcryptjs.hash(pass, 8) 
         
        // Insertar los datos de acceso
        await queryAsync('INSERT INTO datosa (CorreoA, PassA) VALUES (?, ?)', [user, passHash]);

        // Obtener el ID generado automáticamente
        const resultsAcceso = await queryAsync('SELECT LAST_INSERT_ID() AS idAcceso');

        // El ID generado automáticamente
        const idAcceso = resultsAcceso[0].idAcceso;
        
        // Insertar los datos generales utilizando el ID obtenido anteriormente
        await queryAsync('INSERT INTO datosg (NombreG, ApellidoP, ApellidoM, idDatosA) VALUES (?, ?, ?, ?)', [name, appat, apmat, idAcceso]);
        
        res.redirect('/postRegistro');
    } catch (error) {   
        console.error(error);
        res.status(500).json({ error: 'Hubo un error al registrar el usuario' });
    }        
}


exports.IniciarSesionUsuario = async (req, res) => {
    try {
        const user1 = req.body.user
        const pass1 = req.body.pass

        // Consultar el usuario y la contraseña en la base de datos
        const results = await queryAsync('SELECT idDatosA   , idDatosA FROM datosa WHERE CorreoA = ? AND PassA = ?', [user1, pass1]);


        if (results.length === 0) {
            // Si no se encuentra un usuario con las credenciales proporcionadas, retornar un mensaje de error
            return res.render('login_usuario', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Usuario y/o contraseña incorrectos",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 1000,
                ruta: 'Login'
            });
        }

        // Generar el token JWT
        const userId = results[0].idDatosA;
        const token = jwt.sign({ userId: userId }, process.env.JWT_SECRETO, {
            expiresIn: process.env.JWT_TIEMPO_EXPIRA
        });

          // Obtener el ID de usuario y el ID de datos de acceso
        const datosAccesoId = results[0].idDatosA;

        console.log(datosAccesoId)
        res.render('Login_usuario', {
            alert: true,
            alertTitle: "Conexión exitosa",
            alertMessage: "¡LOGIN CORRECTO!",
            alertIcon:'success',
            showConfirmButton: false,
            timer: 800,
            ruta: 'loginBien'
       })

    } catch (error) {
        console.log(error)
    }
}

exports.IniciarSesionUsuario2 = async (req, res) => {
    try {
        const user = req.body.user;
        const pass = req.body.pass;

        // Consultar el usuario en la base de datos
        const results = await queryAsync('SELECT idDatosA, CorreoA, PassA FROM datosa WHERE CorreoA = ?', [user]);

        if (results.length === 0 || !await bcryptjs.compare(pass, results[0].PassA)) {
            console.log(results)
            // Si no se encuentra un usuario con las credenciales proporcionadas o la contraseña no coincide, retornar un mensaje de error
            return res.render('login2', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Usuario y/o contraseña incorrectos",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 1000,
                ruta: 'Logindos'
            });
        }

        // Obtener información del usuario para incluir en el token JWT
        const userId = results[0].idDatosA;
        const userEmail = results[0].CorreoA;

        const resultadosUser = await queryAsync('SELECT idDatosG, NombreG FROM datosg WHERE idDatosA = ?', [userId]);


        const Id_usuario = resultadosUser[0].idDatosG;
        const nom_usuario = resultadosUser[0].NombreG;


        // Generar el token JWT con más información del usuario
        const token = jwt.sign({ idDatosG: Id_usuario, NombreG: nom_usuario, idDatosA:userId }, process.env.JWT_SECRETO, {
            //expiresIn: process.env.JWT_COOKIE_EXPIRES
        });
        console.log(token+' tokensin')

        // Enviar el token JWT al cliente
        res.cookie('jwt', token, {
           // expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true
        
        });

        // Redirigir al usuario a una página de inicio o dashboard después de iniciar sesión
        res.render('vista_usuario', {
            alert: true,
            alertTitle: "Conexión exitosa",
            alertMessage: "¡LOGIN CORRECTO!",
            alertIcon: 'success',
            showConfirmButton: false,
            timer: 800,
            ruta: 'loginBien'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error al iniciar sesión' });
    }
};

//https://chat.openai.com/share/016ea8e8-d7f7-4a18-9c0a-5f163dbfc1fa


exports.isAuthenticadosi = async (req, res, next) => {
    console.log("Middleware de autenticación en ejecución");
    if (req.cookies.jwt) {
        try {
            // Descifrar la cookie para obtener los datos del usuario
            const cookieusuarioDeco = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
            console.log(cookieusuarioDeco+' cuqui decodificada del metodo is autenticadosi');

            // Consultar la base de datos para obtener los datos del usuario
            conexion.query('SELECT * FROM datosg WHERE idDatosA = ?', [cookieusuarioDeco.idDatosA], (error, resultsUser) => {
                if (error) {
                    console.log(error);
                    return next();
                }
                if (resultsUser && resultsUser.length > 0) {
                    // Asignar los datos del usuario a req.usuario
                    
                    req.usuario = resultsUser[0];

                    console.log('codigo entre el req usuario')
                    console.log(req.usuario)
                    console.log('codifo entre el req usuario, me lo trae en json')

                    console.log(req.usuario + ' sdel if si no es vacio el req.usuario');
                    console.log(cookieusuarioDeco);
                    console.log('por laguna razon si le pongo texto al objeto solo imprime [object Object] sdel if si no es vacio el req.usuario ')
                }
                return next();
            });
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        res.redirect('/noautenticado')
    }
}
//ahroa debemos crear los metodo para poder leer la info de la cuki


exports.logout = (req, res)=>{
    res.clearCookie('jwt')   
    return res.redirect('/')
}

exports.ObtenerInfo = async (req, res, next) => {
    try {
        const cookieusuarioDeco = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
        console.log(cookieusuarioDeco+'primer tri cuqui deco');
        
        conexion.query('SELECT * FROM datosg WHERE idDatosA = ?', [cookieusuarioDeco.idDatosA], (error, resultsUser) => {

            // Asignar los datos del usuario a req.usuario
            usuario = resultsUser[0];
            console.log(usuario+'esto es el usuario');
            console.log(cookieusuarioDeco+'esto es la cuki');
        
        return next();
        });


    } catch (error) {
        console.log(error+'error al obtener la info')
    }
    
}
