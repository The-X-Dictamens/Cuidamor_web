const conexionU = require('../database/db_User');
const { promisify } = require('util');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Convierte la función query en una función que devuelve una promesa
const queryAsync = promisify(conexionU.query).bind(conexionU);

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
        await queryAsync('INSERT INTO datos_acceso (cor_datu, pas_datu) VALUES (?, ?)', [correo, passHash]);

        // Obtener el ID generado automáticamente
        const resultsAccesoU = await queryAsync('SELECT LAST_INSERT_ID() AS id_datu');

        // El ID generado automáticamente
        const idAcceso = resultsAccesoU[0].id_datu;
        
        // Insertar los datos generales utilizando el ID obtenido anteriormente
        await queryAsync('INSERT INTO usuario (id_datu, nom_use  VALUES (?, ?)', [idAcceso, name]);
        
        res.redirect('/Tablero');
    } catch (error) {   
        console.error(error);
        res.status(500).json({ error: 'Hubo un error al registrar el usuario' });
    }        
}


/**metodo para agregar direccion del usuario */

/**metodo para mostrar las direcciones del usuario */

/**metpodo para registrar paciente */

/**metodo para crear chamba */

/*
*

y todos los metodos correspondientes para editar estos mismos datos

*/

exports.IniciarSesionUsuario = async (req, res) => {
    
    try {
        const correo = req.body.correoe;
        const contrasena = req.body.passe;

        let passHashe = await bcryptjs.hash(contrasena, 8) 


        console.log('Este es iniciarsesion user'+ correo + contrasena)

        // Consultar el usuario en la base de datos
        const results = await queryAsync('SELECT id_datu , pas_datu FROM datos_acceso WHERE cor_dat = ? ', [correo]);
        console.log(results)
        if (results.length === 0 || !await bcryptjs.compare(contrasena, results[0].pas_dat)) {
            console.log(results)

            // Si no se encuentra un usuario con las credenciales proporcionadas o la contraseña no coincide, retornar un mensaje de error
            return res.render('./Usuario/LoginU', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Usuario y/o contraseña incorrectos",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 1000,
                ruta: 'Iniciar_sesion_usuario'
            });
        }

        // Obtener información del usuario para incluir en el token JWT
        const userId = results[0].id_dat;
        const userEmail = results[0].cor_dat;

        const resultadosUser = await queryAsync('SELECT id_use, nom_use, idd_use FROM usuario WHERE id_datu = ?', [userId]);


        const Id_user = resultadosUser[0].id_use;
        const nom_enf = resultadosUser[0].nom_emplo;
        const perm_enf = resultadosUser[0].id_perm;
        const veri_enf = resultadosUser[0].veri_user;



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

exports.logout = (req, res)=>{
    res.clearCookie('jwt')   
    return res.redirect('/')
}

