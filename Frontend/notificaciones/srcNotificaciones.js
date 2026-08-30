/**
 * Este archivo está listo para cuando conecten la Base de Datos.
 * Las notificaciones en indexNotificaciones.html son de prueba
 * TAMBIEN CONSIDERAR CREAR LA TABLA NOTIFICACIONES DENTRO DE LA ESTRUCTURA DE LA BD!!
 * LÓGICA DE BADGE (Campanita):
 * Para mostrar el puntito rojo/azul en la campana del Dashboard, 
 * solo debes contar cuántas notificaciones tienen `leida === false`.
 * 
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /*
    // EJEMPLO DE CÓDIGO PARA CUANDO TENGAN LOS DATOS DEL BACKEND:

    const contenedor = document.getElementById('listaNotificaciones');

    function renderizarNotificaciones(notificacionesBD) {
        // Limpiamos el contenedor
        contenedor.innerHTML = '';

        notificacionesBD.forEach(notif => {
            
            // Evaluamos si está leída o no para cambiar los estilos
            const estiloFondo = notif.leida ? 'bg-white opacity-70 border-slate-100' : 'bg-blue-50/40 border-blue-50 hover:bg-blue-50/80';
            const estiloTitulo = notif.leida ? 'font-bold text-slate-800' : 'font-extrabold text-slate-900';
            const estiloFecha = notif.leida ? 'font-medium text-slate-400' : 'font-bold text-blue-600';
            const estiloTexto = notif.leida ? 'font-medium text-slate-500' : 'font-semibold text-slate-700';
            
            // El puntito azul solo aparece si no está leída
            const puntitoHTML = notif.leida ? '' : '<div class="absolute top-1/2 -translate-y-1/2 left-2 w-1.5 h-1.5 bg-blue-600 rounded-full"></div>';
            const margenIcono = notif.leida ? 'ml-1.5' : ''; // Para alinear el ícono si no hay puntito

            const notifHTML = `
                <div class="p-4 ${estiloFondo} border-b flex gap-4 transition cursor-pointer relative">
                    ${puntitoHTML}
                    <div class="w-10 h-10 rounded-full ${notif.colorFondoIcono} flex items-center justify-center ${notif.colorIcono} shrink-0 ${margenIcono}">
                        <i class="${notif.iconoClase}"></i>
                    </div>
                    <div class="flex-1">
                        <div class="flex justify-between items-start mb-0.5">
                            <h4 class="text-xs ${estiloTitulo}">${notif.titulo}</h4>
                            <span class="text-[9px] ${estiloFecha}">${notif.fechaCorto}</span>
                        </div>
                        <p class="text-[10px] ${estiloTexto} leading-tight pr-2">${notif.mensaje}</p>
                    </div>
                </div>
            `;
            
            contenedor.innerHTML += notifHTML;
        });
    }

    // Ejemplo de datos devueltos por el backend:
    const mockData = [
        {
            titulo: 'Transferencia recibida',
            mensaje: 'Franco C. te envió $1.500,00.',
            fechaCorto: 'Hoy, 14:30',
            iconoClase: 'fa-solid fa-money-bill-transfer',
            colorFondoIcono: 'bg-blue-100',
            colorIcono: 'text-blue-600',
            leida: false
        },
        {
            titulo: '¡Bienvenido a AlkyWall!',
            mensaje: 'Tu cuenta fue creada con éxito.',
            fechaCorto: 'Ayer',
            iconoClase: 'fa-solid fa-hand-wave',
            colorFondoIcono: 'bg-slate-100',
            colorIcono: 'text-slate-500',
            leida: true
        }
    ];

    // renderizarNotificaciones(mockData);
    */

    // ============================================================================
    // LÓGICA DE INTERACCIÓN (Solo Frontend)
    // ==========================================================================
    
    // Función para transformar visualmente una notificación a "leída"
    const marcarComoLeida = (notif) => {
        if (!notif.classList.contains('notif-no-leida')) return;
        notif.classList.remove('bg-blue-50/40', 'border-blue-50', 'hover:bg-blue-50/80', 'notif-no-leida');
        notif.classList.add('bg-white', 'border-slate-100', 'hover:bg-slate-50', 'opacity-70');
        const puntito = notif.querySelector('.puntito-azul');
        if (puntito) puntito.remove();
        const icono = notif.querySelector('.icono-wrapper');
        if (icono) icono.classList.add('ml-1.5');
        const titulo = notif.querySelector('.notif-titulo');
        if (titulo) {
            titulo.classList.remove('font-extrabold', 'text-slate-900');
            titulo.classList.add('font-bold', 'text-slate-800');
        }
        
        const fecha = notif.querySelector('.notif-fecha');
        if (fecha) {
            fecha.classList.remove('font-bold', 'text-blue-600');
            fecha.classList.add('font-medium', 'text-slate-400');
        }
        
        const texto = notif.querySelector('.notif-texto');
        if (texto) {
            texto.classList.remove('font-semibold', 'text-slate-700');
            texto.classList.add('font-medium', 'text-slate-500');
        }
    };

    // Al tocar UNA notificación no leída
    const notificacionesNoLeidas = document.querySelectorAll('.notif-no-leida');
    notificacionesNoLeidas.forEach(notif => {
        notif.addEventListener('click', () => {
            marcarComoLeida(notif);
        });
    });

    // Al tocar el botón superior "Marcar todas como leídas"
    const btnMarcarTodas = document.getElementById('btnMarcarTodas');
    if (btnMarcarTodas) {
        btnMarcarTodas.addEventListener('click', () => {
            // Buscamos de nuevo porque algunas ya podrían haber sido clickeadas
            document.querySelectorAll('.notif-no-leida').forEach(notif => {
                marcarComoLeida(notif);
            });
            btnMarcarTodas.classList.remove('text-blue-600', 'hover:bg-blue-50');
            btnMarcarTodas.classList.add('text-slate-300', 'cursor-default');
        });
    }


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
