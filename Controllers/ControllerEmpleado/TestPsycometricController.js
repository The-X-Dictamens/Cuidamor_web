const coneccion = require("../database/db");
const {promisify} = require('util');
const query = promisify(coneccion.query).bind(coneccion);
const {readFile} = require('fs/promises');
const e = require("express");

////////////////////////////////////////////////
/*Funciones para el control y manejo de datos*/
async function readThisFile(dirpath){
    try{
        const data = await readFile(dirpath);
        return JSON.parse(data.toString());
    }catch(err){
        console.error(err);
    }
    
}
//ontener un numero aleatorio entre uno y dos
function randomNum(){
    return Math.floor(Math.random() * 1) ;
} 
//funcion para sumar los puntajes de las pruebas psicometricas
function sumarPuntajes(objeto) {
    let suma = 0;
    for (let key in objeto) {
        suma += parseInt(objeto[key]);
    }
    return suma;
}
///////////////////////////////funcion para generar y renderizar prueba psicometrica por json/////////////////////////////////////////////
exports.getfirstPrueba = async (req, res) => {
    try{
        const datos = await readThisFile('./testPsicometrics/Pruebas.json');
        let numform = randomNum();
        res.render('Empleado/Prueb-psico-emple',{datos: datos.pruebas[numform],numform: numform});
    } catch (err) {
        console.error(err);
    }
}
///////////////////////////////funcion de cachado y envio de informacion de resultados de pruebas psciometricas//////////////////////////
exports.postPrueba = async (req, res) => {
    //obtenemos los datos del empleado y sus datos de acceso
    let id_datacc = req.userData.id_datacc;
    let empleado = await query('SELECT * FROM empleado WHERE id_datacc = ?', [id_datacc]);
    let id = empleado[0].id_emp;
    //obtenemos los datos de la prueba y sus reglas de aceptacion
    let numform = req.query.form;
    const formularios = await readThisFile('./testPsicometrics/Pruebas.json');
    const reglasform = formularios.pruebas[numform].reglas_aceptacion[0].PuntajeMin;
    let respuestas = req.body;
    let puntaje = sumarPuntajes(respuestas);
    const resultado = puntaje >= reglasform ? 'Aprobado' : 'Reprobado';

    //valido si la tabla existe y si no se crea
    let pruebas = await query('SELECT * FROM pruebas WHERE id_emp = ?', [id]);
    if(pruebas.length == 0){
        await query('INSERT INTO pruebas (id_emp, est_prue) VALUES (?,?)', [id, resultado]);
        pruebas = await query('SELECT * FROM pruebas WHERE id_emp = ?', [id]);
    }
    //si la tabla existe se actualiza
    await query('UPDATE pruebas SET tip_pru = ?, punt_pru = ?, est_prue = ? WHERE id_emp = ?', [numform,puntaje,resultado,id]);
    res.redirect('/validacionEmpleado');

}

