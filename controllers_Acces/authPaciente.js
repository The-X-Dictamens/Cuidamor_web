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

exports.crearEmpleado = async (req, res) => {
    
    if (req.session.user) {
        try {
            //obtencion de los datos del formulario
            let { nombre, apellido_paterno, apellido_materno, correo, numero_telefono, calle, colonia, codigo_postal, alcaldia, cedula_profesional, puesto} = req.body;
            let dataAcces = await query("INSERT INTO datos_acceso (cor_datacc, rol_datacc) VALUES (?,?)", [correo, puesto]);
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
        }
        
    } else {
        res.redirect("/");
    }    
};