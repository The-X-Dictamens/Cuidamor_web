const express = require('express')
const routerA = express.Router()

routerA.get('/Loginadmin', (req, res)=>{
    res.render('./Admin/', {alert:false})
})


routerA.get('/ValidarINfo', (req, res)=>{
    res.render('./Admin/', {alert:false})
})


module.exports = routerA