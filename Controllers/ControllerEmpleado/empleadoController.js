const conexionU = require('../database/db');
const { promisify } = require('util');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken');
const e = require('express');
const cloudController = require("../ControllersMain/cloudController");
const query = promisify(conexionU.query).bind(conexionU);
const validacion = require('../Validators/Validator')


/////////////////////////Mostrar apartado de registro de cliente/////////////////////////////
exports.VistaRegistroEmpleado = (req, res)=>{
   res.render('Empleado/RegistroEmpleado',{alert: false})
}
/////////////////////////Advertencia de segundo paso de registro de empleado/////////////////////////////
exports.VistaAdvLogeoEmpleado = (req, res)=>{
    res.render('Empleado/adviceLogeo',{alert: false})
}
/////////////////////////Registro de empleado en la base de datos/////////////////////////////
exports.AuthRegitrarEmpleado = async (req, res) => {
    
    const {nombre, apellidoMaterno, apellidoPaterno, rol ,telefono, correo, contrasena, confirmarContrasena, calle, numeroExterior, numeroInterior, colonia, delegacion, codigoPostal} = req.body;
    const valid = validacion.ValidacionRegistroEmpleado(nombre, apellidoMaterno, apellidoPaterno, rol , telefono, correo, contrasena, confirmarContrasena, calle, numeroExterior, numeroInterior, colonia, delegacion, codigoPostal);
    if(!valid.valid){
        console.log(req.body)
        // Verificar si el correo ya está registrado
        const correoRegistrado = await query('SELECT * FROM datos_acceso WHERE cor_datacc = ?', [correo]);
        if(correoRegistrado.length > 0){
            res.status(400).json({message: 'correo'});
        }
        else{
            // Encriptar contraseña
            const passwordHash = await bcryptjs.hash(contrasena, 8);
            // Insertar datos en la base de datos
            let datacces = await query('INSERT INTO datos_acceso (cor_datacc, pas_datacc, rol_datacc) VALUES (?, ?, ?)', [correo, passwordHash, rol]);
            let datdireccion = await query('INSERT INTO direccion (calle_dir, del_dir, numExt_dir, numInt_dir, col_dir, cp_dir, ref_dir) VALUES (?, ?, ?, ?, ?, ?, ?)', [calle, delegacion, numeroExterior, numeroInterior, colonia, codigoPostal, null]);
            let datempleado = await query('INSERT INTO empleado (nom_emp, pat_emp, mat_emp, fot_emp, tel_emp, est_emp, cred_emp, id_datacc, id_dir) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [nombre, apellidoPaterno, apellidoMaterno , null , telefono, 'Proceso' , 0.0 , datacces.insertId, datdireccion.insertId]);
            res.status(200).json({message: 'success'});
        }
    }else{
        res.status(400).json({message: 'Algunos campos son inválidos.'});
    }
    
}
/////////////////////////Ruta para subir los archivos de validacion de expediente y pruebas psicometricas/////////////////////////////
exports.VistaValidacionEmpleado = async (req, res) => {
    //obtenemos los documentos si es que hay alguno que falta
    let id = req.userData.id_datacc;
    let docs = {}
    //obtenemos los datos de el perfil y pruebas
    let empleado = await query('SELECT * FROM empleado WHERE id_datacc = ?', [id]);
    let perfil_profecional = await query('SELECT * FROM perfil_profecional WHERE id_emp = ?', [empleado[0].id_emp]);
    let pruebas = await query('SELECT * FROM pruebas WHERE id_emp = ?', [empleado[0].id_emp]);
    //obtenemos la foto
    docs.foto = empleado[0].fot_emp;
    //si el perfil no existe agregar vacio
    if(perfil_profecional.length == 0){
        docs.cedula = null;
        docs.ine = null;
        docs.certificados = null;
        docs.comprobante = null;
    }else{
        //si el perfil existe se obtienen los documentos
        docs.cedula = perfil_profecional[0].cedu_prof; 
        docs.ine = perfil_profecional[0].ine_prof;
        docs.certificados =  perfil_profecional[0].cert_prof;
        docs.comprobante =  perfil_profecional[0].comdom_prof;
    }
    //se hace lo mismo para las pruebas
    if(pruebas.length == 0){
        docs.pruebas = null;
    }else{
        docs.pruebas = pruebas[0].est_prue;
    }
    //si el perfil existe se obtienen los documentos 
    console.log(docs)
    res.render('Empleado/validacionEmpleado',{docs: docs, alert: false});
}
/////////////////////////Subir archivos a la base de datos/////////////////////////////
exports.AuthSubirDocumentos = async (req, res) => {
    //obtenemos el id de la cuenta del empleado
    let id_datacc = req.userData.id_datacc;
    //obtenemos el id del empleado
    let empleado = await query('SELECT * FROM empleado WHERE id_datacc = ?', [id_datacc]);
    let id = empleado[0].id_emp;
    //con operadores ternanior le doy valor
    let cedula = !req.body.cedula ? null : req.body.cedula;
    let fotografia = !req.files.fotografia ? null : req.files.fotografia[0];
    let certificados = !req.files.certificados ? null : req.files.certificados[0];
    let comprobanteDomicilio = !req.files.comprobanteDomicilio ? null : req.files.comprobanteDomicilio[0];
    let ine = !req.files.ine ? null : req.files.ine[0];

    const test = validacion.ValidacionRegistroEmpleado2(cedula, fotografia, certificados, comprobanteDomicilio, ine);
    if(test.valid){
        //validacion de existencia de la tabla perfil_profecional
        let perfil = await query('SELECT * FROM perfil_profecional WHERE id_emp = ?', [id]);
        if(perfil.length == 0){
            //si no existe se crea
            let insperfil = await query('INSERT INTO perfil_profecional (id_emp) VALUES (?)', [id]);
            perfil = await query('SELECT * FROM perfil_profecional WHERE id_emp = ?', [id]);
        }

        //se actualizan los datos de la tabla perfil_profecional para cada documento si no es null dandole un nombre unico
        if(certificados !== null){
            let nomcert = 'certificado_'+id+'.pdf';
            await cloudController.upload(certificados, nomcert);
            await query('UPDATE perfil_profecional SET cert_prof = ? WHERE id_emp = ?', [nomcert, id]);
        }
        if(comprobanteDomicilio !== null){
            let nomcom = 'comprobante_'+id+'.pdf';
            await cloudController.upload(comprobanteDomicilio, nomcom);
            await query('UPDATE perfil_profecional SET comdom_prof = ? WHERE id_emp = ?', [nomcom, id]);
        }
        if(ine !== null){
            let nomine = 'ine_'+id+'.pdf';
            await cloudController.upload(ine, nomine);
            await query('UPDATE perfil_profecional SET ine_prof = ? WHERE id_emp = ?', [nomine, id]);
        }
        if(fotografia !== null){
            let nomfot = 'fotografia_'+id+ fotografia.originalname.split('.')[1];
            await cloudController.upload(fotografia, nomfot);
            await query('UPDATE empleado SET fot_emp = ? WHERE id_emp = ?', [nomfot, id]);
        }
        if(cedula !== null){
            await query('UPDATE perfil_profecional SET cedu_prof = ? WHERE id_emp = ?', [cedula, id]);
        }

        

        //se suben los archivos a la nube y se suben los datos a la base de datos si no son null

        res.status(200).json({valid:true, message: 'success'});
    }else{
        res.status(400).json({valid:false, message: 'Algunos campos son inválidos.'});
    }
    
    
}
/////////////////////////Mostrar apartado de visualizacion de Trabajo actual/////////////////////////////
exports.VistaMiTrabajoActual = async (req, res) => {
    //obtenemos el id de datos de acceso
    let id_datacc = req.userData.id_datacc;
    let cor_datacc = req.userData.cor_datacc;
    //obtenemos el id de empleado
    let empleado = await query('SELECT * FROM empleado WHERE id_datacc = ?', [id_datacc]);
    //obtenemos la imagen de perfil
    let foto = await cloudController.getUrl(empleado[0].fot_emp);
    //
    let perfilData = {correo: cor_datacc, foto: foto};
    


    //renderizar sus trabajos actuales
    res.render('Empleado/inicio',{perfil: perfilData, alert: false});
}
/////////////////////////Mostrar vacantes existentes/////////////////////////////
exports.VistaVacantes = async (req, res) => {
    //obtenemos el id de datos de acceso
    let id_datacc = req.userData.id_datacc;
    let cor_datacc = req.userData.cor_datacc;
    //obtenemos el id de empleado
    let empleado = await query('SELECT * FROM empleado WHERE id_datacc = ?', [id_datacc]);
    //obtenemos la imagen de perfil
    let foto = await cloudController.getUrl(empleado[0].fot_emp);
    //
    let perfilData = {correo: cor_datacc, foto: foto};
    
    //renderiza la vista de vacantes
    res.render('Empleado/vacantes',{perfil: perfilData, alert: false});
}
///////////////////////Mostrar apartado de trabajos anterirormente realizados/////////////////////////////
exports.VistaTrabajosAnteriores = async (req, res) => {
    //obtenemos el id de datos de acceso
    let id_datacc = req.userData.id_datacc;
    let cor_datacc = req.userData.cor_datacc;
    //obtenemos el id de empleado
    let empleado = await query('SELECT * FROM empleado WHERE id_datacc = ?', [id_datacc]);
    //obtenemos la imagen de perfil
    let foto = await cloudController.getUrl(empleado[0].fot_emp);
    let credit = empleado[0].cred_emp;
    //
    let perfilData = {correo: cor_datacc, foto: foto, credit: credit};

    //ontendremos los datos para cada trabajo anterior
    let trabajos = await query(`SELECT s.id_sol AS IDTrabajo, e.nom_emp AS NombreEmpleado, s.des_sol AS DescripcionSolicitud, s.cost_sol AS Costo, s.est_sol AS EstadoSolicitud,
           CASE WHEN s.est_sol = 'Final' THEN 'Pagado' ELSE 'No Pagado' END AS EstadoCobro, 
           u.nom_us AS NombreCliente, u.pat_us AS ApellidoPaternoCliente, u.mat_us AS ApellidoMaternoCliente
    FROM empleado e
    JOIN solicitud s ON e.id_emp = s.id_emp
    JOIN user u ON s.id_us = u.id_us
    WHERE s.est_sol = 'Final' AND e.id_emp = ?`, [empleado[0].id_emp]);

    console.log(trabajos)


    //renderizar trabajos anteriores
    res.render('Empleado/LastTrabajos',{perfil: perfilData, trabajos: trabajos, alert: false});
}
/////////////////////////Mostrar apartado de configuracion de cuenta/////////////////////////////
exports.VistaConfiguracionCuenta = async (req, res) => {
    //obtenemos el id de datos de acceso
    let id_datacc = req.userData.id_datacc;
    let cor_datacc = req.userData.cor_datacc;
    //obtenemos el id de empleado
    let empleado = await query('SELECT * FROM empleado WHERE id_datacc = ?', [id_datacc]);
    //obtenemos la imagen de perfil
    let foto = await cloudController.getUrl(empleado[0].fot_emp);
    let perfilData = {correo: cor_datacc, foto: foto, nombre: empleado[0].nom_emp, paterno: empleado[0].pat_emp, materno: empleado[0].mat_emp, telefono: empleado[0].tel_emp};

    //renderizar configuracion de cuenta
    res.render('Empleado/configuracion',{perfil: perfilData, alert: false});
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////Metodos de configuracion de cuenta///////////////////////////////////////////////////////
exports.AuthActualizarFoto = async (req, res) => {
    //obtenemos el id de datos de acceso
    let id_datacc = req.userData.id_datacc;
    //obtenemos el id de empleado
    let empleado = await query('SELECT * FROM empleado WHERE id_datacc = ?', [id_datacc]);
    let id = empleado[0].id_emp;
    //obtenemos la foto del forms
    let foto = !req.files.fotografia[0] ? null : req.files.fotografia[0];
    //validamos la foto
    const test = validacion.ValidacionActualizarFotoPerfil(foto);
    if(test.valid){
        //subimos la foto a la nube
        let nomfot = 'foto_'+id+ foto.originalname.split('.')[1];
        await cloudController.delete(empleado[0].fot_emp);
        await cloudController.upload(foto, nomfot);
        //actualizamos la foto en la base de datos
        await query('UPDATE empleado SET fot_emp = ? WHERE id_emp = ?', [nomfot, id]);
        res.status(200).json({valid:true, message: 'success'});
    }else{
        res.status(400).json({valid:false, message: test.messages[0]});
    }
}
/////////////////////////Actualizar datos personales/////////////////////////////
exports.AuthUpdatePersonData = async (req, res) => {
    const { firstName, middleName, lastName, phone, email, currentPassword } = req.body;
    //obtenemos la contraseña de datos de acceso
    let id_datacc = req.userData.id_datacc;
    let datacc = await query('SELECT * FROM datos_acceso WHERE id_datacc = ?', [id_datacc]);
    let pas_datacc = datacc[0].pas_datacc;
    //comparamos la contraseña
    const validpass = await bcryptjs.compare(currentPassword, pas_datacc);
    
    if(validpass){
        let valid = validacion.ValidacionActualizarDatosPersonales(firstName, middleName, lastName, phone, email);
        if(valid.valid){
            //actualizamos los datos personales
            await query('UPDATE empleado SET nom_emp = ?, pat_emp = ?, mat_emp = ?, tel_emp = ? WHERE id_datacc = ?', [firstName, lastName, middleName, phone, id_datacc]);
            //actualizamos el correo
            await query('UPDATE datos_acceso SET cor_datacc = ? WHERE id_datacc = ?', [email, id_datacc]);

            res.status(200).json({valid:true, message: 'Finalizado, se cerra la sesion para aplicar los cambios.'});
        }else{
            res.status(400).json({valid:false, message: valid.messages[0]});
        }
    }else{
        res.status(400).json({valid:false, message: 'Contraseña incorrecta.'});
    }
}
/////////////////////////Actualizar contraseña/////////////////////////////
exports.AuthUpdatePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    //obtenemos la contraseña de datos de acceso
    let id_datacc = req.userData.id_datacc;
    let datacc = await query('SELECT * FROM datos_acceso WHERE id_datacc = ?', [id_datacc]);
    let pas_datacc = datacc[0].pas_datacc;
    //comparamos la contraseña
    const validpass = await bcryptjs.compare(currentPassword, pas_datacc);
    
    if(validpass){
        //validamos la nueva contraseña
        const valid = validacion.ValidacionActualizarContrasena(newPassword, confirmPassword);
        if(valid.valid){
            //encriptamos la nueva contraseña
            const passwordHash = await bcryptjs.hash(newPassword, 8);
            //actualizamos la contraseña
            await query('UPDATE datos_acceso SET pas_datacc = ? WHERE id_datacc = ?', [passwordHash, id_datacc]);
            res.status(200).json({valid:true, message: 'Contraseña actualizada. Se cerrará la sesión para aplicar los cambios.'});
        }else{
            res.status(400).json({valid:false, message: valid.messages[0]});
        }
    }else{
        res.status(400).json({valid:false, message: 'Contraseña incorrecta.'});
    }
}


//////////////////////////////////////////////////////////////////////////////////
exports.VistaAgregarCreditos = async (req, res) => {
    let id_sol = req.query.id
    let id_datacc = req.userData.id_datacc;
    //obtenemos el id de empleado
    let empleado = await query('SELECT * FROM empleado WHERE id_datacc = ?', [id_datacc]);
    //
    let solicitud = await query('SELECT * FROM solicitud WHERE id_sol = ? AND id_emp = ? AND cobr_sol = ?', [id_sol, empleado[0].id_emp, 'Pagado']);
    if(solicitud.length == 0){
        res.redirect('/TrabajosAnteriores');
    }else{
        let credits = empleado[0].cred_emp;
        let costo = solicitud[0].cost_sol;

        let credit2 = parseFloat(credits);
        let costo2 = parseFloat(costo);

        let sumacreditos = credit2 + costo2;

        await query('UPDATE empleado SET cred_emp = ? WHERE id_datacc = ?', [sumacreditos, id_datacc]);
        await query('UPDATE solicitud SET cobr_sol = ? WHERE id_sol = ?', ['Cobrado', id_sol]);
        res.redirect('/TrabajosAnteriores');
    }

}




