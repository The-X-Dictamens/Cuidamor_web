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
        const correo = req.body.user;
        const pass = req.body.pass;
        const appat = req.body.appat; 
        const apmat = req.body.apmat;
        const tele =  req.body.tel;
        const celu =  req.body.cel;

        let passHash = await bcryptjs.hash(pass, 8) 
         
        // Insertar los datos de acceso
        await queryAsync('INSERT INTO datos_acceso (cor_dat, pas_dat) VALUES (?, ?)', [correo, passHash]);

        // Obtener el ID generado automáticamente
        const resultsAccesoE = await queryAsync('SELECT LAST_INSERT_ID() AS id_dat');

        // El ID generado automáticamente
        const idAcceso = resultsAccesoE[0].id_dat;
        
        // Insertar los datos generales utilizando el ID obtenido anteriormente
        await queryAsync('INSERT INTO empleado (id_dat, nom_emplo, appat_emplo, apmat_emplo, cel_emplo,tel_emplo) VALUES (?, ?, ?, ?, ?, ?)', [idAcceso, name, appat, apmat, celu, tele]);
        
        res.redirect('/postRegistro');
    } catch (error) {   
        console.error(error);
        res.status(500).json({ error: 'Hubo un error al registrar el usuario' });
    }        
}

/*
exports.IniciarSesionEnfermera = async (req, res) => {
    try {
        console.log('Inicio')

        const correo = req.body.cor;
        const pass = req.body.pass;

        console.log(correo + pass)

        // Consultar el usuario en la base de datos                                          //no necesitamo comparar esta aqui
        const resultadosEnfermeraLogin = await queryAsync('SELECT id_dat FROM datos_acceso WHERE cor_dat = ? ', [correo]);
        console.log('debaho de resultados')

        if (resultadosEnfermeraLogin.length === 0 || !await bcryptjs.compare(pass, resultadosEnfermeraLogin[0].pas_dat)) {
            // Si no se encuentra un usuario con las credenciales proporcionadas o la contraseña no coincide, retornar un mensaje de error
            console.log('debajo del ig')

            return res.render('./Enfermera/LoginE', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Usuario y/o contraseña incorrectos",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 1000,
                ruta: 'Iniciar_sesion_enfermera'
            });
        }

        // Obtener información del usuario para incluir en el token JWT
        const userId = results[0].id_dat;

        const resultadosEnfermeraInfo = await queryAsync('SELECT id_emplo, nom_emplo,veri_user FROM datosg WHERE id_dat = ?', [userId]);


        const Id_Enfermera = resultadosEnfermeraInfo[0].id_emplo;
        const nom_Enfermera = resultadosEnfermeraInfo[0].nom_emplo;
        let perm_Enfermera = resultadosEnfermeraInfo[0].veri_user;


        // Generar el token JWT con más información del usuario
        const token = jwt.sign({ id_emplo: Id_Enfermera, nom_emplo: nom_Enfermera, id_dat:userId, veri_user:perm_Enfermera }, process.env.JWT_SECRETO, {
            //expiresIn: process.env.JWT_COOKIE_EXPIRES
        });
        console.log(token+' tokensin')

        // Enviar el token JWT al cliente
        res.cookie('jwt', token, {
           // expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true
        
        });

        // Redirigir al usuario a una página de inicio o dashboard después de iniciar sesión
        res.render('VacantesE', {
            alert: true,
            alertTitle: "Conexión exitosa",
            alertMessage: "¡LOGIN CORRECTO!",
            alertIcon: 'success',
            showConfirmButton: false,
            timer: 800,
            ruta: 'Visualizar_vacantes'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error al iniciar sesión' +error +'mamaste'});
    }
};
*/

exports.IniciarSesionEnfermeras = async (req, res) => {
    
    try {
        const correo = req.body.correoe;
        const contrasena = req.body.passe;

        let passHashe = await bcryptjs.hash(contrasena, 8) 


        console.log('Este es iniciarsesion 2'+ correo + contrasena)

        // Consultar el usuario en la base de datos
        const results = await queryAsync('SELECT id_dat , pas_dat FROM datos_acceso WHERE cor_dat = ? ', [correo]);
        console.log(results)
        if (results.length === 0 || !await bcryptjs.compare(contrasena, results[0].pas_dat)) {
            console.log(results)

            // Si no se encuentra un usuario con las credenciales proporcionadas o la contraseña no coincide, retornar un mensaje de error
            return res.render('./Enfermera/LoginE', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Usuario y/o contraseña incorrectos",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 1000,
                ruta: 'Iniciar_sesion_enfermera'
            });
        }

        // Obtener información del usuario para incluir en el token JWT
        const userId = results[0].id_dat;
        const userEmail = results[0].cor_dat;

        const resultadosEnfer = await queryAsync('SELECT id_emplo, nom_emplo FROM empleado WHERE id_dat = ?', [userId]);


        const Id_enf = resultadosEnfer[0].id_emplo;
        const nom_enf = resultadosEnfer[0].nom_emplo;
        const perm_enf = resultadosEnfer[0].id_perm;
        const veri_enf = resultadosEnfer[0].veri_user;



        // Generar el token JWT con más información del usuario
        const token = jwt.sign({ id_emplo: Id_enf, nom_emplo: nom_enf, idDatosA:userId, veri_user:veri_enf , id_perm:perm_enf}, process.env.JWT_SECRETO, {
            //expiresIn: process.env.JWT_COOKIE_EXPIRES
        });
        console.log(token+' tokensin')

        // Enviar el token JWT al cliente
        res.cookie('jwt', token, {
           // expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true
        
        });

        // Redirigir al usuario a una página de inicio o dashboard después de iniciar sesión
        res.render('./Enfermera/VacantesE', {
            alert: true,
            alertTitle: "Conexión exitosa",
            alertMessage: "¡LOGIN CORRECTO!",
            alertIcon: 'success',
            showConfirmButton: false,
            timer: 800,
            ruta: 'Visualizar_vacantes'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error al iniciar sesión' });
    }
};


exports.EnfermeraAuth = async (req, res, next) => {
    console.log("Middleware de autenticación en ejecución");
    if (req.cookies.jwt) {
        try {
            // Descifrar la cookie para obtener los datos del usuario
            const cookieusuarioDeco = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
            console.log(cookieusuarioDeco+' cuqui decodificada del metodo is autenticadosi');

            // Consultar la base de datos para obtener los datos del usuario
            conexion.query('SELECT * FROM datos_acceso WHERE id_dat = ?', [cookieusuarioDeco.id_dat], (error, resultsEnfer) => {
                if (error) {
                    console.log(error);
                    return next();
                }
                if (resultsEnfer && resultsEnfer.length > 0) {
                    // Asignar los datos del usuario a req.usuario
                    
                    req.usuario = resultsEnfer[0];

                    console.log(req.usuario)

                    console.log(cookieusuarioDeco);
                }
                return next();
            });
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        console.log('ubicate pa')
        res.redirect('noautenticado')
        
    }
}

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
exports.DocsVerify = async (req, res, next) => {
    console.log('entrando a la verificacion de los documentos ')
}

