import { Router } from "express"

const router = Router()

router.get('/registroenfermer', (req, res)=>{
    res.render('registro_enfemera', {alert:false})
})


export default router