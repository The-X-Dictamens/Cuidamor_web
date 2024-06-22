
//funcion de validacion de datos de registro de cliente

exports.ValidacionRegistroCliente = function validacion(nombre, apellidoMaterno, apellidoPaterno, telefono, correo, contrasena, confirmarContrasena){
    const errors = [];

    // Validación de nombre
    if (!/^[a-zA-Z]{2,}$/.test(nombre)) {
        errors.push("Nombre inválido: debe contener solo letras y tener al menos 2 caracteres.");
    }

    // Validación de apellido paterno
    if (!/^[a-zA-Z]{2,}$/.test(apellidoPaterno)) {
        errors.push("Apellido paterno inválido: debe contener solo letras y tener al menos 2 caracteres.");
    }

    // Validación de apellido materno
    if (!/^[a-zA-Z]{2,}$/.test(apellidoMaterno)) {
        errors.push("Apellido materno inválido: debe contener solo letras y tener al menos 2 caracteres.");
    }

    // Validación de correo
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(correo)) {
        errors.push("Correo electrónico inválido.");
    }

    // Validación de contraseña
    if (!/^.{8,}$/.test(contrasena)) {
        errors.push("Contraseña inválida: debe tener al menos 8 caracteres.");
    }

    // Validación de confirmar contraseña
    if (contrasena !== confirmarContrasena) {
        errors.push("Las contraseñas no coinciden.");
    }

    if (!/^\d{10}$/.test(telefono)) { // Asegúrate de que el teléfono tiene 10 dígitos, puedes ajustar según sea necesario
        errors.push("Teléfono inválido: debe contener solo dígitos y tener 10 caracteres.");
    }

    if (errors.length > 0) {
        return { valid: false, messages: errors };
    } else {
        return { valid: true };
    }
}

exports.ValidacionRegistroEmpleado = function validacion(nombre, apellidoMaterno, apellidoPaterno, telefono, correo, contrasena, confirmarContrasena, calle, numeroExterior, numeroInterior, colonia, delegacion, codigoPostal){
    const errors = [];

    // Validación de nombre
    if (!/^[a-zA-Z]{2,}$/.test(nombre)) {
        errors.push("Nombre inválido: debe contener solo letras y tener al menos 2 caracteres.");
    }

    // Validación de apellido paterno
    if (!/^[a-zA-Z]{2,}$/.test(apellidoPaterno)) {
        errors.push("Apellido paterno inválido: debe contener solo letras y tener al menos 2 caracteres.");
    }

    // Validación de apellido materno
    if (!/^[a-zA-Z]{2,}$/.test(apellidoMaterno)) {
        errors.push("Apellido materno inválido: debe contener solo letras y tener al menos 2 caracteres.");
    }

    // Validación de correo
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(correo)) {
        errors.push("Correo electrónico inválido.");
    }

    // Validación de contraseña
    if (!/^.{8,}$/.test(contrasena)) {
        errors.push("Contraseña inválida: debe tener al menos 8 caracteres.");
    }

    // Validación de confirmar contraseña
    if (contrasena !== confirmarContrasena) {
        errors.push("Las contraseñas no coinciden.");
    }

    if (!/^\d{10}$/.test(telefono)) { // Asegúrate de que el teléfono tiene 10 dígitos, puedes ajustar según sea necesario
        errors.push("Teléfono inválido: debe contener solo dígitos y tener 10 caracteres.");
    }

    if (!/^[a-zA-Z\s]{2,}$/.test(calle)) {
        errors.push("Calle inválida: debe contener solo letras y tener al menos 2 caracteres.");
    }

    if (!/^\d{1,}$/.test(numeroExterior)) {
        errors.push("Número exterior inválido: debe contener solo dígitos y tener al menos 1 caracter.");
    }

    if (!/^\d{1,}$/.test(numeroInterior)) {
        errors.push("Número interior inválido: debe contener solo dígitos y tener al menos 1 caracter.");
    }

    if (!/^[a-zA-Z\s]{2,}$/.test(colonia)) {
        errors.push("Colonia inválida: debe contener solo letras y tener al menos 2 caracteres.");
    }

    if (!/^[a-zA-Z\s]{2,}$/.test(delegacion)) {
        errors.push("Delegación inválida: debe contener solo letras y tener al menos 2 caracteres.");
    }

    if (!/^\d{5}$/.test(codigoPostal)) {
        errors.push("Código postal inválido: debe contener solo dígitos y tener 5 caracteres.");
    }

    if (errors.length > 0) {
        return { valid: false, messages: errors };
    } else {
        return { valid: true };
    }
}
