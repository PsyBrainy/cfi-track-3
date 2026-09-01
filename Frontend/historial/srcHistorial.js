document.addEventListener('DOMContentLoaded', () => {

    // LÓGICA DEL BOTÓN VOLVER

    const btnVolver = document.getElementById('btnVolver');
    if (btnVolver) {
        btnVolver.addEventListener('click', () => {
            // Efecto de fade out
            document.body.classList.add('opacity-0');
            setTimeout(() => {
                window.history.back(); 
            }, 100);
        });
    }


    // DATOS HARDCODEADOS (Simulando la BD)

    // Para probar el texto "No hay operaciones", cambia este array a vacío: []
    const operacionesBD = [
        {
            id: 1,
            titulo: "Transferencia enviada",
            descripcion: "A Franco C.",
            monto: -5000.00,
            iconoClase: "fa-solid fa-arrow-up",
            colorIcono: "text-red-500",
            bgIcono: "bg-red-50",
            bordeIcono: "border-red-100",
            fecha: "Hoy"
        },
        {
            id: 2,
            titulo: "Transferencia recibida",
            descripcion: "De Jonatan M.",
            monto: 15000.00,
            iconoClase: "fa-solid fa-arrow-down",
            colorIcono: "text-green-500",
            bgIcono: "bg-green-50",
            bordeIcono: "border-green-100",
            fecha: "Ayer"
        },
        {
            id: 3,
            titulo: "NETFLIX",
            descripcion: "Compra",
            monto: -12500.00,
            iconoClase: "fa-solid fa-compact-disc",
            colorIcono: "text-pink-500",
            bgIcono: "bg-pink-50",
            bordeIcono: "border-pink-100",
            fecha: "25 de Agosto"
        },
        {
            id: 4,
            titulo: "STEAM",
            descripcion: "Compra de software",
            monto: -19640.00,
            iconoClase: "fa-brands fa-steam-symbol",
            colorIcono: "text-sky-500",
            bgIcono: "bg-sky-50",
            bordeIcono: "border-sky-100",
            fecha: "24 de Agosto"
        }
    ];



    // RENDERIZADO DEL HISTORIAL Y FILTROS

    const listaMovimientos = document.getElementById('listaMovimientos');
    const msgHistorialVacio = document.getElementById('msgHistorialVacio');
    const botonesFiltro = document.querySelectorAll('.filtro-btn');

    const renderizarLista = (filtro = 'todos') => {
        if (!listaMovimientos || !msgHistorialVacio) return;

        listaMovimientos.innerHTML = '';
        
        let datosFiltrados = operacionesBD;
        if (filtro === 'ingresos') {
            datosFiltrados = operacionesBD.filter(op => op.monto > 0);
        } else if (filtro === 'egresos') {
            datosFiltrados = operacionesBD.filter(op => op.monto < 0);
        }

        if (datosFiltrados.length === 0) {
            // Mostrar mensaje vacío
            msgHistorialVacio.classList.remove('hidden');
            msgHistorialVacio.classList.add('flex');
            listaMovimientos.classList.add('hidden');
        } else {
            // Ocultar mensaje vacío
            msgHistorialVacio.classList.add('hidden');
            msgHistorialVacio.classList.remove('flex');
            listaMovimientos.classList.remove('hidden');

            let fechaActual = "";

            datosFiltrados.forEach(op => {
                
                // Mostrar separador de fecha si cambia
                if (op.fecha !== fechaActual) {
                    fechaActual = op.fecha;
                    listaMovimientos.innerHTML += `<h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 mt-2 px-1">${fechaActual}</h4>`;
                }

                const esIngreso = op.monto > 0;
                const colorMonto = esIngreso ? 'text-green-600' : 'text-slate-800';
                const signo = esIngreso ? '+' : '-';
                const montoFormateado = Math.abs(op.monto).toLocaleString('es-AR', { minimumFractionDigits: 2 });
                
                const tarjetaHTML = `
                    <div class="p-4 rounded-[20px] bg-white border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-100 transition cursor-pointer">
                        <div class="flex items-center gap-3">
                            <div class="w-11 h-11 rounded-full border ${op.bordeIcono} flex items-center justify-center ${op.colorIcono} ${op.bgIcono} shrink-0">
                                <i class="${op.iconoClase} text-sm"></i>
                            </div>
                            <div class="flex flex-col">
                                <p class="text-sm font-bold text-slate-800 leading-tight">
                                    ${op.titulo}
                                </p>
                                <p class="text-[10px] font-medium text-slate-400 mt-0.5">${op.descripcion}</p>
                            </div>
                        </div>
                        <span class="text-xs font-bold ${colorMonto} tracking-wide shrink-0 ml-2">${signo} $ ${montoFormateado}</span>
                    </div>
                `;
                listaMovimientos.innerHTML += tarjetaHTML;
            });
        }
    };

    // Inicializar con 'todos'
    renderizarLista('todos');

    // Manejar Clicks en los Filtros
    botonesFiltro.forEach(btn => {
        btn.addEventListener('click', () => {
            //Quitar estilos activos de todos
            botonesFiltro.forEach(b => {
                b.classList.remove('bg-slate-900', 'text-white', 'shadow-md', 'activo');
                b.classList.add('bg-white', 'border', 'border-slate-200', 'text-slate-600', 'hover:bg-slate-50');
            });

            // Aplicar estilos activos al clickeado
            btn.classList.add('bg-slate-900', 'text-white', 'shadow-md', 'activo');
            btn.classList.remove('bg-white', 'border', 'border-slate-200', 'text-slate-600', 'hover:bg-slate-50');

            //  Renderizar lista filtrada
            const filtroElegido = btn.getAttribute('data-filtro');
            renderizarLista(filtroElegido);
        });
    });

});
