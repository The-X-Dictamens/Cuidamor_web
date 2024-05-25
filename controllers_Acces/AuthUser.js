const conexionU = require('../database/db');
const { promisify } = require('util');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cloudController = require("./cloudController");
const query = promisify(conexionU.query).bind(conexionU);


// Convierte la función query en una función que devuelve una promesa
const queryAsync = promisify(conexionU.query).bind(conexionU);

//procedimiento para registrarnos

/**metodo para agregar direccion del usuario 
/**metodo para mostrar las direcciones del usuario 
/**metpodo para registrar paciente 
/**metodo para crear chamba 


y todos los metodos correspondientes para editar estos mismos datos

*/

exports.IniciarSesionUsuario = async (req, res) => {
    try {
        let { correo, contrasena } = req.body;
        let passHashe = await bcryptjs.hash(contrasena, 8) 
        console.log('Este es iniciarsesion user'+ correo + contrasena)
        // Consultar el usuario en la base de datos
        const results = await queryAsync('SELECT id_datacc , pas_datacc FROM datos_acceso WHERE cor_datacc = ? ', [correo]);
        console.log(results)
        if (results.length === 0 || !await bcryptjs.compare(contrasena, results[0].pas_datacc)) {
            console.log(results)
            // Si no se encuentra un usuario con las credenciales proporcionadas o la contraseña no coincide, retornar un mensaje de error
            return res.render('./Usuario/LoginU', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Usuario y/o contraseña incorrectos",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 1000,
                ruta: 'Tablero'
            });
        }
        // Obtener información del usuario para incluir en el token JWT
        const Id_acc = results[0].id_datacc;
        const userEmail = results[0].cor_datacc;

        const resultadosUser = await queryAsync('SELECT id_us, nom_us FROM user WHERE id_datacc = ?', [Id_acc]);
        const Id_user = resultadosUser[0].id_us;
        const nom_user = resultadosUser[0].nom_us;

        // Generar el token JWT con más información del usuario
        const token = jwt.sign({ id_datacc: Id_acc, nom_us: nom_user, cor_datacc: userEmail}, process.env.JWT_SECRETO, {
            //expiresIn: process.env.JWT_COOKIE_EXPIRES
        });
        console.log(token+' tokensin')

        // Enviar el token JWT al cliente
        res.cookie('jwt', token, {
           // expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true
        });
        // Redirigir al usuario a una página de inicio o dashboard después de iniciar sesión
        res.render('./Usuario/userIndex', {
            alert: true,
            alertTitle: "Conexión exitosa",
            alertMessage: "¡LOGIN CORRECTO!",
            alertIcon: 'success',
            showConfirmButton: false,
            timer: 800,
            ruta: 'Tablero',
            user: {
                id: Id_user,
                name: nom_user,
                email: userEmail
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error al iniciar sesión' });
    }
};

exports.UserAuth = async (req, res, next) => {
    console.log("Middleware de autenticación en ejecución");
    if (req.cookies.jwt) {
        try {
            // Descifrar la cookie para obtener los datos del usuario
            const cookieusuarioDeco = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
            estado = cookieusuarioDeco.est_emp
            console.log(estado +' de mexico')
             
            // Consultar la base de datos para obtener los datos del usuario
            conexion.query('SELECT * FROM user WHERE id_datacc = ?', [cookieusuarioDeco.id_datacc], (error, resultsUser) => {
                if (error) {
                    console.log(error);
                    return next();
                }//aqyu podre asignarle ese if?
                req.user = resultsUser[0];
                return next();
            }); /**aqui segun yo puse el parentresis delif */
        } catch (error) {
            console.log(error+' error al autenticar');
            return next();
        }
    } else {
        console.log('ubicate pa')
        res.redirect('noautenticado')
        
    }
}
exports.VisualizarVacantes = async (req, res) => {
    let idC = req.user.id;
    let vacantes = await query('SELECT * FROM solicitud WHERE id_us = ?', [idC]);
    console.log(vacantes)
    res.render('./Usuario/userIndex', {alert:false})
}

exports.logout = (req, res)=>{
    res.clearCookie('jwt')   
    return res.redirect('/')
}

exports.logout = (req, res)=>{
    res.clearCookie('jwt')   
    return res.redirect('/')
}

/**
 * que pasa si yo quiero consumir algo en un lenguje de programacion diferente
 * si necesito que esa app se conecte en postGress??
 * necesitamos un servidor que se encargue de recibir las peticiones y enviar las respuestas
 * y eso se llama API REST , son traductores de un codigo a otro
 * el traductor se llama JSON, le envias un JSON y te regresa un JSON 
 * mandamos una lista de datos y nos regresa una lista de datos
 * lo que hacemos en mantenimiento es, actualizaciones
 * 
 * cambiando de tema para nuestro soporte
 * el minimo de levantar ticket, gestionar ticket
 * asignarlo, darle seguimineot y de acuerdo 
 * al nuestra politica de soporte si se puede marcar como resuelto, en curso etc
 */


/**
 * registrar Paciente
 */

exports.crearUsuario = async (req, res) => {
    
    try {
        //obtencion de los datos del formulario
        let { nombre, apellido_paterno, apellido_materno, correo,passw, numero_telefono, calle, colonia, codigo_postal, alcaldia} = req.body;
        //cifrado de la contraseña

        //verificar correo
        let correoExistente = await query("SELECT cor_datacc FROM datos_acceso WHERE cor_datacc = ?", [correo]);

        if (correoExistente.length > 0) { 
            return res.render('./Usuario/RegisterU', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Correo ya registrado",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 1000,
                ruta: 'Registrarme'
            });
             
        }
        let passHashe = await bcryptjs.hash(passw, 8)

        let dataAcces = await query("INSERT INTO datos_acceso (cor_datacc,pas_datacc, rol_datacc) VALUES (?,?,'cliente')", [correo,passHashe]);

        let idDataAcces = dataAcces.insertId;

        

        //incercion de los datos en la base de datos
        let dataDireccion = await query("INSERT INTO direccion (del_dir, col_dir, calle_dir, cp_dir) VALUES (?,?,?,?)",[alcaldia, colonia, calle, codigo_postal])
        let idDataDirec = dataDireccion.insertId;

        let U = await query("INSERT INTO user (nom_us, pat_us, mat_us, fot_us, tel_us, id_datacc, id_dir) VALUES (?,?,?,'N/A',?,?,?)", [nombre, apellido_paterno, apellido_materno, numero_telefono, idDataAcces, idDataDirec]);
        let iduser = U.insertId;
        console.log("exito")


        //redireccion a la pagina de empleados en proceso
        res.redirect("/Tutorial");
        

    } catch (err) {
        console.error(err);
    }
    
  
};


