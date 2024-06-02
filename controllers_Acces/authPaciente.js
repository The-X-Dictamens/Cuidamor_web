const conexionU = require('../database/db');
const { promisify } = require('util');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const conexion = require('../database/db');


// Convierte la función query en una función que devuelve una promesa
const queryAsync = promisify(conexionU.query).bind(conexionU);

exports.registrarPac = async (req, res) => {
    
        try {
            //obtencion de los datos del formulario
            let { nombre, apellido_paterno, apellido_materno, fotoPa, medicam, descrip, tratami, receta } = req.body;
            //const userId = req.user.id_us;
            console.log(req.user)            //obtencion de los los carchivos y sus nombres
            

            //Ahora uno para la foto 
            /*
            let fotoP = req.files["foto"][0];
            var namefpmuser = fotoP.fieldname + "-" + idDataAcces + "." + fotoP.originalname.split(".").pop();
          
            //utilizaremos la funcion de gardado de documentos en los dockers
            let subirFotoP = cloudController.upload(namefpmuser, namefpmuser);
*/

            //incercion de los datos en la base de datos

            //let U = await query("INSERT INTO user (nom_us, pat_us, mat_us, fot_us, tel_us, id_datacc, id_dir) VALUES (?,?,?,'N/A',?,?,?)", [nombre, apellido_paterno, apellido_materno, numero_telefono, idDataAcces, idDataDirec]);
            //let iduser = U.insertId;


            //redireccion a la pagina de empleados en proceso
            //res.redirect("/Tablero");
            

        } catch (err) {
            console.error(err);
        }
        
      
};


