    // Función para actualizar el contador cada segundo
    function actualizarContador() {
        // Obtener la hora actual en milisegundos
        var ahora = new Date().getTime();
        
        // Obtener la hora en que el usuario accedió a la página o la última vez que se actualizó la página
        var horaInicial = localStorage.getItem('horaInicial');
        
        if (!horaInicial) {
            // Si no hay una hora inicial registrada, establecerla como la hora actual
            horaInicial = ahora;
            localStorage.setItem('horaInicial', horaInicial);
        }
        
        // Calcular el tiempo transcurrido desde la hora inicial
        var tiempoTranscurrido = ahora - horaInicial;
        
        // Calcular el tiempo restante hasta que pasen 24 horas
        var tiempoRestante = 24 * 60 * 60 * 1000 - tiempoTranscurrido;
        
        // Calcular las horas, minutos y segundos restantes
        var horas = Math.floor(tiempoRestante / (1000 * 60 * 60));
        var minutos = Math.floor((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60));
        var segundos = Math.floor((tiempoRestante % (1000 * 60)) / 1000);
        
        // Formatear los valores para que siempre tengan dos dígitos
        horas = String(horas).padStart(2, '0');
        minutos = String(minutos).padStart(2, '0');
        segundos = String(segundos).padStart(2, '0');
        
        // Mostrar el contador en el formato HH:MM:SS
        document.getElementById("contador").innerHTML = horas + ":" + minutos + ":" + segundos;
        
        // Calcular y mostrar la hora final
        var horaFinal = new Date(ahora + tiempoRestante);
        var horaFinalFormato = horaFinal.toLocaleTimeString();
        document.getElementById("horaFinal").innerHTML = "Hora final: " + horaFinalFormato;
    }

    // Actualizar el contador cada segundo
    setInterval(actualizarContador, 1000);

    // Llamar a la función para actualizar el contador inmediatamente
    actualizarContador();
