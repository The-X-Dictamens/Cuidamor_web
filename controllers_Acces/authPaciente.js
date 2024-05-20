const conexionU = require('../database/db_User');
const { promisify } = require('util');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const conexion = require('../database/db_User');


// Convierte la función query en una función que devuelve una promesa
const queryAsync = promisify(conexionU.query).bind(conexionU);

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
// este soquete solo lo ponemos aqui  para que no "estorbe" su unica funcion sera que lo puedan crear, fuera de ahi que lo puedan editar

exports.registrarPac = async (req, res) => {
    
        try {
            //obtencion de los datos del formulario
            let { nombre, apellido_paterno, apellido_materno, correo, pass, numero_telefono, calle, colonia, codigo_postal, alcaldia } = req.body;
            let passHash = await bcryptjs.hash(pass, 8)    

            let dataAcces = await query("INSERT INTO datos_acceso (cor_datacc, rol_datacc) VALUES (?,?,'cliente')", [correo,passHash]);
            let idDataAcces = datacces.insertId;

            //obtencion de los los carchivos y sus nombres
            
            
            let comprobante_domicilio = req.files["comprobante_domicilio"][0];
            var namecomuser = comprobante_domicilio.fieldname + "-" + idDataAcces + "." + comprobante_domicilio.originalname.split(".").pop();
         
            //utilizaremos la funcion de gardado de documentos en los dockers
            let subrcomprobante = cloudController.upload(comprobante_domicilio, namecomuser);

            //Ahora uno para la foto 
            let fotoP = req.files["foto"][0];
            var namefpmuser = fotoP.fieldname + "-" + idDataAcces + "." + fotoP.originalname.split(".").pop();
          
            //utilizaremos la funcion de gardado de documentos en los dockers
            let subirFotoP = cloudController.upload(namefpmuser, namefpmuser);


            //incercion de los datos en la base de datos
            let dataDireccion = await query("INSERT INTO direccion (del_dir, col_dir, calle_dir, cp_dir) VALUES (?,?,?,?)",[alcaldia, colonia, calle, codigo_postal])
            let idDataDirec = dataDireccion.insertId;

            let U = await query("INSERT INTO user (nom_us, pat_us, mat_us, fot_us, tel_us, id_datacc, id_dir) VALUES (?,?,?,'N/A',?,?,?)", [nombre, apellido_paterno, apellido_materno, numero_telefono, idDataAcces, idDataDirec]);
            let iduser = U.insertId;


            //redireccion a la pagina de empleados en proceso
            res.redirect("/Tablero");
            

        } catch (err) {
            console.error(err);
        }
        
      
};


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