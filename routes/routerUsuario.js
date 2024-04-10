const express = require('express')
const routerU = express.Router()


routerU.get('/', (req, res)=>{
    res.render('index', )
})

module.exports = routerU