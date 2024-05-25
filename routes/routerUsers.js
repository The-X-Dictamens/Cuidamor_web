const express = require('express');
const router = express.Router();

router.get('/', function(req,res){
    res.render('index',{alert:false});
});

router.get('/c',function(req,res){
    res.render('landing_new',{alert:false});
})

router.use('/postular',function(req,res){
    res.render('registroEmpleado',{alert:false})
}) 

router.use((req, res, next)=>{
    res.status(404).render("404")
});
router.use(function(err, req, res, next){

    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
}); 



module.exports = router;