const jwt = require('jsonwebtoken');

//Middleware para verificar si el token es valido
exports.verifyTokenLoged = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    console.log('no token')
    return res.status(403).redirect('/Iniciar_sesion'); 
  }

  //se verifica el token y se envia los datos del usuario Cliente
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if(err){
      return res.status(403).redirect('/')
    }
    req.userData = decoded;
    next();
  })
}


//Middleware para verificar si el token es valido para clientes
exports.verifyTokenLogedClient = (req, res, next) => {
  const token = req.cookies.jwt;
  //si no existe ningun token se redirecciona a la pagina de login
  if (!token) {
    console.log('no token')
    return res.status(403).redirect('/Iniciar_sesion'); 
  }

  //se verifica el token y se envia los datos del usuario Cliente
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      //si el token no es valido se redirecciona a la pagina de login
      return res.status(401).redirect('/Iniciar_sesion'); 
    }
    //si el token no es de un cliente se redirecciona a la ruta corrspondiente
    if(decoded.rol != 'Cliente'){
      switch(decoded.rol){
        case 'Enfermero':
          return res.status(403).redirect('/MenuEmpleado');
        case 'Cuidador':
          return res.status(403).redirect('/MenuEmpleado');
        default:
          return res.status(403).redirect('/Iniciar_sesion');
      }
    }
    req.userData = decoded;
    next();
  });

};

//Middleware para verificar si el token es valido para empleados
exports.verifyTokenLogedEmployee = (req, res, next) => {
  const token = req.cookies.jwt;
  //si no existe ningun token se redirecciona a la pagina de login
  if (!token) {
    console.log('no token')
    return res.status(403).redirect('/Iniciar_sesion'); 
  }

  //se verifica el token y se envia los datos del usuario Empleado
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      //si el token no es valido se redirecciona a la pagina de login
      return res.status(401).redirect('/Iniciar_sesion'); 
    }
    //verificar su estado de la cuenta NO ESTE EN PROCESO
    if(decoded.estado = 'Proceso'){
      return res.status(403).redirect('/validacionEmpleado');
    }
    //VERIFICAR QUE NO ESTE RECHAZADO
    if(decoded.estado = 'Rechazado'){
      return res.status(403).redirect('/RechazoEmpleado');
    }
    //si el token no es de un cliente se redirecciona a la ruta corrspondiente
    if(decoded.rol != 'Enfermero' || decoded.rol != 'Cuidador'){
      switch(decoded.rol){
        case 'Cliente':
          return res.status(403).redirect('/MenuCliente');
        default:
          return res.status(403).redirect('/Iniciar_sesion');
      }
    }
    req.userData = decoded;
    next();
  });

};

//Middleware para verificar que el empleado no este en proceso de registro
exports.verifyTokenLogedEmployeeInvalid = (req, res, next) => {
  const token = req.cookies.jwt;
  //si no existe ningun token se redirecciona a la pagina de login
  if (!token) {
    return res.status(403).redirect('/Iniciar_sesion'); 
  }
  //se verifica el token y se envia los datos del usuario Empleado
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).redirect('/Iniciar_sesion'); 
    }
    //verificar que este en proceso de registro
    if(decoded.estado != 'Proceso'){
      switch(decoded.estado){
        case 'Rechazado':
          return res.status(403).redirect('/RechazoEmpleado');
        case 'Aceptado':
          return res.status(403).redirect('/MenuEmpleado');
        default:
          return res.status(403).redirect('/');
      }
    }
    req.userData = decoded;
    next();
  });

}



//Middleware para verificar que no hay alguna session activa
exports.verifyTokenUnLoged = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    console.log('no token')
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
        console.log('tocken invalido', err)
    }
    console.log(decoded);
    req.userData = decoded;
    if(decoded){
        console.log(`redireccionando, se encontro token valido ${decoded.rol}`);
        switch(decoded.rol){
            case 'Cliente':
                return res.status(403).redirect('/MenuCliente');
            case 'Enfermero':
                return res.status(403).redirect('/MenuEmpleado');
            case 'Cuidador':
                return res.status(403).redirect('/MenuEmpleado');
            default:
                return res.status(403).redirect('/');
        }
    }
    next();
  });
}

