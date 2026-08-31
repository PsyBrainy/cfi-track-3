// Pongo a consideración acá que las preferencias podría ser una nueva tabla en la BD 1:1. Lo dejo para pensar

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleNotificaciones');
    const toggleBola = document.getElementById('toggleBola');
    
    // Estado inicial (Este valor debería venir de la BD al cargar la página)
    let notificacionesActivas = true; 

    toggleBtn.addEventListener('click', () => {
        notificacionesActivas = !notificacionesActivas;
        
        if (notificacionesActivas) {
            toggleBtn.classList.replace('bg-slate-300', 'bg-blue-600');
            toggleBola.classList.replace('left-[2px]', 'left-[26px]');
        } else {
            toggleBtn.classList.replace('bg-blue-600', 'bg-slate-300');
            toggleBola.classList.replace('left-[26px]', 'left-[2px]');
        }

        // NOTA PARA EL BACKEND: Aquí iría el fetch()/Axios para guardar la preferencia en BD.
        console.log("Estado de notificaciones guardado:", notificacionesActivas);
    });

    // ==========================================
    // Lógica de Biometría Activada
    // ==========================================
    const toggleBtnBio = document.getElementById('toggleBiometria');
    const toggleBolaBio = document.getElementById('toggleBolaBio');

    let biometriaActiva = false; 

    if (toggleBtnBio && toggleBolaBio) {
        toggleBtnBio.addEventListener('click', () => {
            biometriaActiva = !biometriaActiva;
            
            if (biometriaActiva) {
                toggleBtnBio.classList.replace('bg-slate-300', 'bg-blue-600');
                toggleBolaBio.classList.replace('left-[2px]', 'left-[26px]');
            } else {
                toggleBtnBio.classList.replace('bg-blue-600', 'bg-slate-300');
                toggleBolaBio.classList.replace('left-[26px]', 'left-[2px]');
            }

            console.log("Estado de biometría guardado:", biometriaActiva);
        });
    }

    // Cambiar Alias
    const btnCambiarAlias = document.getElementById('btnCambiarAlias');
    if (btnCambiarAlias) {
        btnCambiarAlias.addEventListener('click', () => {
            // abrir un modal o redirigir a una pantalla
            console.log("Abrir flujo para cambiar Alias...");
        });
    }

    // Cambiar Teléfono
    const btnCambiarTelefono = document.getElementById('btnCambiarTelefono');
    if (btnCambiarTelefono) {
        btnCambiarTelefono.addEventListener('click', () => {
            // Lógica de cambio de teléfono
            console.log("Abrir flujo para cambiar Teléfono...");
        });
    }

    // Eliminar Cuenta
    const btnEliminarCuenta = document.getElementById('btnEliminarCuenta');
    if (btnEliminarCuenta) {
        btnEliminarCuenta.addEventListener('click', () => {
            // Es vital que aca haya una confirmación doble de seguridad
            console.log("¡CUIDADO! Iniciar flujo de Eliminación de Cuenta.");
        });
    }

    // Lógica del botón Volver con transición suave
    const btnVolver = document.getElementById('btnVolver');
    if (btnVolver) {
        btnVolver.addEventListener('click', () => {
            document.body.classList.add('opacity-0'); // Dispara el fade-out
            setTimeout(() => {
                window.history.back(); // Regresa a la página anterior después de 100ms
            }, 100);
        });
    }

});
