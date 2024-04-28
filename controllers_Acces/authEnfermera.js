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
        //me falta agregar la foto
        const tel = req.body.tel;
        const rol = req.body.rolTrabajador;//para esti necesitamos una lista que contenga el pero con los values de enfe y cuid
        const deleg = req.body.Delega;
        const colon = req.body.Colonia;
        const calle = req.body.Calle;
        const codpo = req.body.CodigoP;
        const refer = req.body.Refere
        const estado = 'Proceso'

        let passHash = await bcryptjs.hash(pass, 8)    
        // Insertar los datos de acceso 
        /**
         * datos de acceso y direccion si se incertan bien
         */
        await queryAsync('INSERT INTO datos_acceso (cor_datacc, pas_datacc, rol_datacc) VALUES (?, ?, ?)', [correo, passHash, rol]);
        
        await queryAsync('INSERT INTO direccion (del_dir,col_dir,calle_dir,cp_dir, ref_dir) VALUES (?,?,?,?,?)', [deleg, colon, calle, codpo, refer]);
         /**
         * hay una mamadita, tambien necesito insertarle la deireccion, asi que...
         * no se si pueida tener multiples cosas como aqui asi que intentemoslo
         */
        // Obtener el ID generado automáticamente
        const resultsAccesoE = await queryAsync('SELECT LAST_INSERT_ID() AS id_datacc');//se supopne que obtengo el id para poder insertarlo

        const resultDireccionE = await queryAsync('SELECT LAST_INSERT_ID() AS id_dir');

        ///////////
        
        // El ID generado automáticamente
        const idAcceso = resultsAccesoE[0].id_datacc;
        const idDireccion = resultDireccionE[0].id_dir;
        
        // Insertar los datos generales utilizando el ID obtenido anteriormente
        //id gene nombre, pater, materno, tele estado veru, datos acce                                           1.,2,3,4,5,6                            1,2,3,4,5,6
                                        //          1       2       3       4       5   6
        await queryAsync('INSERT INTO empleado (nom_emp, pat_emp, mat_emp, tel_emp, est_emp, id_datacc , id_dir) VALUES (?, ?, ?, ?, ?, ?, ?)', [ name, appat, apmat, tel,estado, idAcceso, idDireccion]);
        
        res.redirect('/postRegistro');
    } catch (error) {   
        console.error(error);
        res.status(500).json({ error: 'Hubo un error al registrar el usuario' });
        res.redirect('/error');
    }        
}


exports.IniciarSesionEnfermeras = async (req, res) => {
    
    try {
        const correo = req.body.correoe;
        const contrasena = req.body.passe;

        console.log('Este es iniciarsesion 2'+ correo + contrasena)

        // Consultar el usuario en la base de datos
        const results = await queryAsync('SELECT id_datacc , pas_datacc, rol_datacc FROM datos_acceso WHERE cor_datacc = ? ', [correo]);
        console.log(results)
        if (results.length === 0 || !await bcryptjs.compare(contrasena, results[0].pas_datacc)) {
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
        const userId = results[0].id_datacc;
        const userEmail = results[0].cor_datacc;//Si cierto pa que quiero esto
        const rol = results[0].rol_datacc;

        const resultadosEnfer = await queryAsync('SELECT id_emp, nom_emp,pat_emp est_emp, id_dir FROM empleado WHERE id_datacc = ?', [userId]);

        const Id_enf = resultadosEnfer[0].id_emp;//id sujeto
        const nom_enf = resultadosEnfer[0].nom_emp;//nombre sujeto
        const paterno = resultadosEnfer[0].pat_emp; //apellido sujeto
        const solicitud = resultadosEnfer[0].est_emp;// estado enfermero
        const direccion = resultadosEnfer[0].id_dir;//direccion sujeto
        //su tipo de usuarioque ya capture en la consulta anterior 



        // Generar el token JWT con más información del usuario
        const token = jwt.sign({ id_emp: Id_enf, nom_emp: nom_enf,emp_pat:paterno,est_emp:solicitud, id_datacc:userId, rol_datacc:rol , id_dir:direccion}, process.env.JWT_SECRETO, {
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

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 * para este auth podemos poner elseifelseig que si su verifiacion= 0 la redirija a esperar
 * que sis sus credenciales no son cok al login
 * y el else que la deje ver las vacantes
 * pues al final de cuentas lo que estamos verificacnod es la informacion de la  cuki
 */
//--idea antes de morir '''''
/*
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
                }//aqyu podre asignarle ese if?
                if (resultsEnfer && resultsEnfer.length > 0) {
                    // Asignar los datos del usuario a req.usuario
                    
                    req.usuario = resultsEnfer[0];

                    console.log(req.usuario)

                    console.log(cookieusuarioDeco);
                }
                //aqui ocupo un if, si el veri_user == 0 puesque lo redirija a que no esta autenticado
                return next();
            });
        } catch (error) {
            console.log(error+' error al ');
            return next();
        }
    } else {
        console.log('ubicate pa')
        res.redirect('noautenticado')
        
    }
}*/

exports.EnfermeraAuth = async (req, res, next) => {
    console.log("Middleware de autenticación en ejecución");
    if (req.cookies.jwt) {
        try {
            // Descifrar la cookie para obtener los datos del usuario
            const cookieusuarioDeco = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
            console.log(cookieusuarioDeco+' cuqui decodificada del metodo is autenticadosi');
            if(cookieusuarioDeco.veri_enf == 0)
            res.redirect(noautenticado)
        else{
            // Consultar la base de datos para obtener los datos del usuario
            conexion.query('SELECT * FROM datos_acceso WHERE id_dat = ?', [cookieusuarioDeco.id_dat], (error, resultsEnfer) => {
                if (error) {
                    console.log(error);
                    return next();
                }//aqyu podre asignarle ese if?
                if (resultsEnfer && resultsEnfer.length > 0) {
                    // Asignar los datos del usuario a req.usuario
                    
                    req.usuario = resultsEnfer[0];

                    console.log(req.usuario)

                    console.log(cookieusuarioDeco);
                }
                //aqui ocupo un if, si el veri_user == 0 puesque lo redirija a que no esta autenticado
                return next();
            }); /**aqui segun yo puse el parentresis delif */}
        } catch (error) {
            console.log(error+' error al autenticas');
            return next();
        }
    } else {
        console.log('ubicate pa')
        res.redirect('noautenticado')
        
    }
}

exports.verificarpermiso = (req, res, next) => {
    const token = req.headers['authorization']; // Obtener el token del encabezado Authorization

    if (!token) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }

    jwt.verify(token, 'secreto', (err, decoded) => {
        if (err) {
            return res.status(401).json({ mensaje: 'Token inválido' });
        }

        // Decodificar el token y extraer el ID y el estado de verificación
        req.userId = decoded.id;
        req.verificado = decoded.verificado;

        next(); // Continuar con la siguiente función
    });
};

exports.verificarToken = (req, res, next) => {
    const token = req.headers['authorization']; // Obtener el token del encabezado Authorization

    if (!token) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.JWT_SECRETO, (err, decoded) => { // Utilizar la variable de entorno
        if (err) {
            return res.status(401).json({ mensaje: 'Token inválido' });
        }

        // Decodificar el token y extraer el ID y el estado de verificación
        req.userId = decoded.id;
        req.verificado = decoded.verificado;

        next(); // Continuar con la siguiente función
    });
};



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

/**
 * LA Tercera opcion es hacerlo muy similar al anterior solo que ahi tenga las rutas, segun
 * yo si funcionara ya que solo estamos usando aqui enfermeras, si estoy fuera mas global
 * si habraia que jhacer medio switches para poder mostra las paginas coorresponfietnes por [usuario] 
 */

const EnfermeraAuthVacantes = async (req, res, next) => {
    console.log("Middleware de autenticación para vacantes");
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
                } else {
                    
                
                    if (resultsEnfer && resultsEnfer.length > 0 ) {
                        // Asignar los datos del usuario a req.usuario
                    
                        req.usuario = resultsEnfer[0];
                    }
                }
                if (resultsEnfer && resultsEnfer.length > 0) {
                    // Verificar si el usuario está verificado
                    if (resultsEnfer[0].id_perm === 1) {
                        // Asignar los datos del usuario a req.usuario
                        console.log('que crack si pasasste');
                        return res.redirect('/pagina-deseada'); // Continuar con la siguiente función (ruta)
                    } else {
                        // Usuario no verificado, redirigir a la página de noautenticado
                        return res.redirect('noautenticado');
                    }
                } else {
                    // Usuario no encontrado en la base de datos
                    return next();
                }
            });
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        console.log('ubicate pa');
        return res.redirect('noautenticado');
    }
};


const EnfermeraAuthVacante = async (req, res, next) => {
    console.log("Middleware de autenticación para vacantes");
    if (req.cookies.jwt) {
        try {
            // Descifrar la cookie para obtener los datos del usuario
            const cookieusuarioDeco = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
            console.log(cookieusuarioDeco + ' cuqui decodificada del metodo is autenticadosi');

            // Consultar la base de datos para obtener los datos del usuario
            conexion.query('SELECT * FROM datos_acceso WHERE id_dat = ?', [cookieusuarioDeco.id_dat], (error, resultsEnfer) => {
                if (error) {
                    console.log(error);
                    return next();
                } else {
                    if (resultsEnfer && resultsEnfer.length > 0) {
                        // Asignar los datos del usuario a req.usuario
                        req.usuario = resultsEnfer[0];

                        // Verificar si el usuario está verificado
                        if (resultsEnfer[0].id_perm === 1) {
                            // Asignar los datos del usuario a req.usuario
                            console.log('que crack si pasasste');
                            return res.redirect('/pagina-deseada'); // Continuar con la siguiente función (ruta)
                        } else if (resultsEnfer[0].id_perm === 0) {
                            // Usuario no verificado, redirigir a la página de espera
                            return res.redirect('/pagina-espera');
                        } else {
                            // Otro caso de permiso, redirigir a la página de noautenticado
                            return res.redirect('/noautenticado');
                        }
                    } else {
                        // Usuario no encontrado en la base de datos
                        return next();
                    }
                }
            });
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        console.log('ubicate pa');
        return res.redirect('/noautenticado');
    }
};

/**
 * repsasemos como deberia ser la logica para poder mostrar asi estas mamaditas
 * se supone que el usuario agrega la chamba desde su parte del sistema
 * y de ahi.. que haho, realizo ese insert?
 * mi teoria y lo que puse
 * solo Columns:
id_emp int AI PK 
id_emplo int 
sta_emp tinyint
de la parte del trabajo, en esa lista yo voy a tener los id, en base a esis los ontengo
luego con esos ids realizo la busqueda en la otra bd para traerlos por decirlo de
manera "segura" y si el lo puede editar, ya que desde enfermras solo voy a mostrar los
selecdt que realieze
y ya para construir la pagina pues puedo hacer una calca de la que el usuario tinee
pero sin la parte de editar los datos
 */


