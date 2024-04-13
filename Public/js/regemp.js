function mostrarParte(parte) {
    document.getElementById('parte'+parte).classList.remove('hidden');
    if (parte > 1) {
      document.getElementById('parte'+(parte-1)).classList.add('hidden');
    }
  }
  
  function regresarParte(parte) {
    document.getElementById('parte'+parte).classList.remove('hidden');
    document.getElementById('parte'+(parte+1)).classList.add('hidden');
  }
  
  function mostrarDatos() {
    var formParte1 = document.getElementById('formParte1');
    var formParte2 = document.getElementById('formParte2');
    var formParte3 = document.getElementById('formParte3');
  
    var nombre = formParte1.elements['nombre'].value;
    var apellidoPaterno = formParte1.elements['appat'].value;
    var apellidoMaterno = formParte1.elements['apmat'].value;
    var email = formParte1.elements['email'].value;
    var password = formParte1.elements['pass'].value;
  
    var colonia = formParte2.elements['colonia'].value;
    var numExterior = formParte2.elements['num_exterior'].value;
    var numInterior = formParte2.elements['num_interior'].value;
    var calle = formParte2.elements['calle'].value;
    var codigoPostal = formParte2.elements['codigo_postal'].value;
    var comprobanteDomicilio = formParte2.elements['comprobante_domicilio'].value;
  
    var cedulaProfesional = formParte3.elements['cedula_profesional'].value;
    var tituloProfesional = formParte3.elements['titulo_profesional'].value;
    //var cartaAntecedentesNoPenales = formParte3.elements['carta_antecedentes_no_penales'].value;
    var aniosExperiencia = formParte3.elements['anios_experiencia'].value;
  
    var infoConfirmacion = document.getElementById('infoConfirmacion');
    infoConfirmacion.innerHTML = `
      <p>Nombre: ${nombre}</p>
      <p>Apellido Paterno: ${apellidoPaterno}</p>
      <p>Apellido Materno: ${apellidoMaterno}</p>
      <p>Correo: ${email}</p>
      <p>Contraseña: ${password}</p>
      <p>Colonia: ${colonia}</p>
      <p>Número Exterior: ${numExterior}</p>
      <p>Número Interior: ${numInterior}</p>
      <p>Calle: ${calle}</p>
      <p>Código Postal: ${codigoPostal}</p>
      <p>Comprobante de Domicilio: ${comprobanteDomicilio}</p>
      <p>Cédula Profesional: ${cedulaProfesional}</p>
      <p>Título Profesional: ${tituloProfesional}</p>
      <p>Años de Experiencia: ${aniosExperiencia}</p>
    `;
  
    document.getElementById('parte4').classList.remove('hidden');
  }
  
  function guardarLocalStorage() {
    var formParte1 = document.getElementById('formParte1');
    var formParte2 = document.getElementById('formParte2');
    var formParte3 = document.getElementById('formParte3');
  
    var data = {
      personal: {
        nombre: formParte1.elements['nombre'].value,
        apellidoPaterno: formParte1.elements['appat'].value,
        apellidoMaterno: formParte1.elements['apmat'].value,
        email: formParte1.elements['email'].value,
        password: formParte1.elements['pass'].value
      },
      direccion: {
        colonia: formParte2.elements['colonia'].value,
        numExterior: formParte2.elements['num_exterior'].value,
        numInterior: formParte2.elements['num_interior'].value,
        calle: formParte2.elements['calle'].value,
        codigoPostal: formParte2.elements['codigo_postal'].value,
        comprobanteDomicilio: formParte2.elements['comprobante_domicilio'].value
      },
      documentos: {
        cedulaProfesional: formParte3.elements['cedula_profesional'].value,
        tituloProfesional: formParte3.elements['titulo_profesional'].value,
        cartaAntecedentesNoPenales: formParte3.elements['carta_antecedentes_no_penales'].value,
        aniosExperiencia: formParte3.elements['anios_experiencia'].value
      }
    };
  
    localStorage.setItem('formularioData', JSON.stringify(data));
    alert('han sido enviados Espera la respuesta de tu solicitud.');
  }