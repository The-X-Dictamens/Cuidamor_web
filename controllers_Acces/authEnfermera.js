const conexion = require('../database/db');
const { promisify } = require('util');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cloudController = require('./cloudController');
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

/**
 * 
con docs
exports.crearEmpleado = async (req, res) => {
        try {
            //obtencion de los datos del formulario
            let { nombre, apellido_paterno, apellido_materno, correo, pass, numero_telefono, calle, colonia, codigo_postal, alcaldia, cedula_profesional, puesto } = req.body;
            let passHash = await bcryptjs.hash(pass, 8)    

            let dataAcces = await query("INSERT INTO datos_acceso (cor_datacc, rol_datacc) VALUES (?,?,?)", [correo,passHash, puesto]);
            let idDataAcces = dataAcces.insertId;

            //obtencion de los los carchivos y sus nombres
            let comprobante_domicilio = req.files["comprobante_domicilio"][0];
            var namecomuser = comprobante_domicilio.fieldname + "-" + idDataAcces + "." + comprobante_domicilio.originalname.split(".").pop();
            let ine = req.files["ine"][0];
            var nameineuser = ine.fieldname + "-" + idDataAcces + "." + ine.originalname.split(".").pop();
            let certificados = req.files["certificados"][0];
            var nameceruser = certificados.fieldname + "-" + idDataAcces + "." + certificados.originalname.split(".").pop();

            //utilizaremos la funcion de gardado de documentos en los dockers
            let subrcomprobante = cloudController.upload(comprobante_domicilio, namecomuser);
            let subrine = cloudController.upload(ine, nameineuser);
            let subrcertificados = cloudController.upload(certificados, nameceruser);

            //incercion de los datos en la base de datos
            let dataDireccion = await query("INSERT INTO direccion (del_dir, col_dir, calle_dir, cp_dir) VALUES (?,?,?,?)",[alcaldia, colonia, calle, codigo_postal])
            let idDataDirec = dataDireccion.insertId;

            let empleado = await query("INSERT INTO empleado (nom_emp, pat_emp, mat_emp, fot_emp, tel_emp, est_emp, id_datacc, id_dir) VALUES (?,?,?,'N/A',?,'Proceso',?,?)", [nombre, apellido_paterno, apellido_materno, numero_telefono, idDataAcces, idDataDirec]);
            let idEmpleado = empleado.insertId;

            let perProfesional = await query("INSERT INTO perfil_profecional (cedu_prof,cert_prof,ine_prof,comdom_prof,id_emp) VALUES (?,?,?,?,?)", [cedula_profesional,nameceruser,nameineuser,namecomuser,idEmpleado]);

            //redireccion a la pagina de empleados en proceso
            res.redirect("/Empleadosenproceso");
            

        } catch (err) {
            console.error(err);
            res.redirect("/");

        }
        
        
};

 */


exports.crearUsuario = async (req, res) => {
    
    try {
        //obtencion de los datos del formulario
        let { nombre, apellido_paterno, apellido_materno, rol, correo,passw, numero_telefono, calle, colonia, codigo_postal, alcaldia} = req.body;
        //cifrado de la contraseña

        //verificar correo
        let correoExistente = await query("SELECT cor_datacc FROM datos_acceso WHERE cor_datacc = ?", [correo]);

        if (correoExistente.length > 0) { 
            res.redirect('./Usuario/RegisterU')
            return res.render('./Usuario/RegisterU', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Correo ya registrado",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 1000,
                ruta: 'Tablero'
            });
             
        }
        let passHashe = await bcryptjs.hash(passw, 8)

        let dataAcces = await query("INSERT INTO datos_acceso (cor_datacc,pas_datacc, rol_datacc) VALUES (?,?,'cliente')", [correo,passHashe,rol]);

        let idDataAcces = dataAcces.insertId;

        

        //incercion de los datos en la base de datos
        let dataDireccion = await query("INSERT INTO direccion (del_dir, col_dir, calle_dir, cp_dir) VALUES (?,?,?,?)",[alcaldia, colonia, calle, codigo_postal])
        let idDataDirec = dataDireccion.insertId;

        let U = await query("INSERT INTO user (nom_us, pat_us, mat_us, fot_us, tel_us, id_datacc, id_dir) VALUES (?,?,?,'N/A',?,?,?)", [nombre, apellido_paterno, apellido_materno, numero_telefono, idDataAcces, idDataDirec]);
        let iduser = U.insertId;
        console.log("exito")


        //redireccion a la pagina de empleados en proceso
        res.redirect("/Tablero");
        

    } catch (err) {
        console.error(err);
    }
    
  
}; 

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

        const resultadosEnfer = await queryAsync('SELECT id_emp, nom_emp,pat_emp, est_emp, id_dir FROM empleado WHERE id_datacc = ?', [userId]);

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
            estado = cookieusuarioDeco.est_emp
            console.log(estado +' de mexico')
            if (cookieusuarioDeco.est_emp === 'Proceso') {
                console.log('aguantate a verificarte')
                return res.render('./Enfermera/ViewwithoutVerify')
            }
            // Consultar la base de datos para obtener los datos del usuario
            conexion.query('SELECT id_datacc FROM datos_acceso WHERE id_datacc = ?', [cookieusuarioDeco.id_datacc], (error, resultsEnfer) => {
                if (error) {
                    console.log(error);
                    return next();
                }//aqyu podre asignarle ese if?
                //if (resultsEnfer && resultsEnfer.length > 0) {
                    // Asignar los datos del usuario a req.usuario
                    
                req.usuario = resultsEnfer[0];
                semicuci = cookieusuarioDeco
                //}
                //aqui ocupo un if, si el veri_user == 0 puesque lo redirija a que no esta autenticado
                return next();
            }); /**aqui segun yo puse el parentresis delif */
        } catch (error) {
            console.log(error+' error al autenticas');
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

/**
 * LA Tercera opcion es hacerlo muy similar al anterior solo que ahi tenga las rutas, segun
 * yo si funcionara ya que solo estamos usando aqui enfermeras, si estoy fuera mas global
 * si habraia que jhacer medio switches para poder mostra las paginas coorresponfietnes por [usuario] 
 */





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

const getSolicitudes = (req, res) => { 
    let ordenadasByDate = queryAsync("SELECT * FROM horario >= CURDATE() ORDER BY fecini_hor ASC", (error, results) => {
        if (error) {
            console.log(error+'error al obtener las solicitudes');
            return next();
        }
        console.log(results);
        const idDate = results[0].id_hor;

        return results;
    });
    let solicitudes = queryAsync('SELECT * FROM solicitud WHERE id_us = ?', [req.user.id_us]);
}

exports.getListarSolicitudes = (req, res) => { 
    const query = 'SELECT s.*, h.fecini_hor FROM solicitud s JOIN horario h ON s.id_hor = h.id_hor WHERE h.fecini_hor >= CURDATE() ORDER BY h.fecini_hor ASC';
    
    conexion.query(query, (error, results) => {
        if (error) {
            console.log(error);
            return next();
        }
        console.log(results);
        res.render('./Enfermera/VacantesE', { solicitudes: results });
    });
}

exports.getSolicitudDetalle = (req, res) => {
    const id = req.params.id;
    const query = `
        SELECT s.*, h.fecini_hor, h.fecfin_hor, dh.horini_dh, dh.horfin_dh, dh.dia_dh
        FROM solicitud s
        JOIN horario h ON s.id_hor = h.id_hor
        JOIN dia_horario dh ON h.id_hor = dh.id_hor
        WHERE s.id_sol = ?
    `;
    db.query(query, [id], (error, results) => {
        if (error) {
            return res.status(500).send('Error al obtener los detalles de la solicitud: ' + error.message);
        }
        if (results.length > 0) {
            res.render('./Enfermera/InfoVacanteE', { solicitud: results[0] });
        } else {
            res.status(404).send('No se encontró la solicitud con el ID especificado.');
        }
    });
};
