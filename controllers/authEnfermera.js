const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const {promisify} = require('util')

//procedimiento para registrarnos
exports.register = async (req, res)=>{    
    try {
        const nombres = req.body.nom

        const correo = req.body.cor
        const pass = req.body.pass
        const tell = req.body.tel
        const vali = false



        const apellidoPaterno   =   req.body.appat
        const apellidoMaterno   =   req.body.apmat
        const direccion   =   req.body.dir
        const colonia   =   req.body.col
        const numExterior   =   req.body.nue
        const numInterior   =   req.body.nui
        const calle   =   req.body.cal
        const codigoPostal   =   req.body.cp
        //const comprobanteDomicilio   =   req.body.cd
        const cedulaProfesional   =   req.body.cepro
        //const tituloProfesional   =   req.body.tipro
        const aniosExperiencia = req.body.yxp
        
        let passHash = await bcryptjs.hash(pass, 8)    
        //console.log(passHash)   
        conexion.query('INSERT INTO enfermeras SET ?', {enf_:, enf_:,enf_:,enf_:,enf_:,enf_:,enf_:,enf_:,enf_:,enf_:,enf_:,enf_:,enf_:,enf_:,enf_:,enf_:,enf_:,}, (error, results)=>{
            if(error){console.log(error)}
            res.redirect('/')
        })
    } catch (error) {
        console.log(error)
    }       
}