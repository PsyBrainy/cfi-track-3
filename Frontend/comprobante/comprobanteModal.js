// Archivo para manejar el comprobante de transferencias y pagos
// Se encarga de armar el ticket en pantalla y permitir bajarlo en PDF

// Carga la librería de PDF si todavía no está en la página
function cargarLibreriaPDF() {
    if (window.html2pdf) return Promise.resolve();

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('No se pudo cargar la librería para generar el PDF'));
        document.head.appendChild(script);
    });
}

// Busca el logo de AlkyWall según la página donde estemos parados
function obtenerRutaLogo() {
    const logoExistente = document.querySelector('img[alt*="Logo"], img[alt*="logo"]');
    if (logoExistente && logoExistente.src) {
        return logoExistente.src;
    }
    return '../assets/logo.png';
}

// Genera un número de operación prolijo si no viene uno del backend
function formatearNroOperacion(id) {
    if (!id) {
        return 'OP-' + Math.floor(100000 + Math.random() * 900000);
    }
    return 'OP-' + String(id).padStart(6, '0');
}

// Formatea la fecha y hora a algo bien legible
function formatearFechaComprobante(fechaRaw) {
    const fecha = fechaRaw ? new Date(fechaRaw) : new Date();
    if (isNaN(fecha.getTime())) {
        return new Date().toLocaleString('es-AR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }) + ' hs';
    }
    return fecha.toLocaleString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    }) + ' hs';
}

// Función principal que abre el modal con el comprobante
export function mostrarComprobanteModal(datos) {
    // Si ya hay un modal abierto, lo saco para no duplicar
    const modalPrevio = document.getElementById('modalComprobante');
    if (modalPrevio) modalPrevio.remove();

    const esTransferencia = datos.tipo === 'TRANSFERENCIA';
    const tituloTipo = esTransferencia ? 'Transferencia Enviada' : 'Pago Realizado';
    const fechaTexto = formatearFechaComprobante(datos.fecha);
    const nroOperacion = formatearNroOperacion(datos.nroOperacion || datos.id);
    const logoSrc = obtenerRutaLogo();

    // Formateo el monto
    const montoNumerico = typeof datos.monto === 'number' ? datos.monto : parseFloat(datos.monto || 0);
    const montoFormateado = montoNumerico.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Fila de categoría: solo va en pagos, en transferencias no se muestra
    let filaCategoriaHTML = '';
    if (!esTransferencia && datos.categoria) {
        filaCategoriaHTML = `
            <div class="flex justify-between items-center py-1.5 text-xs">
                <span class="text-slate-400 font-medium">Rubro / Categoría</span>
                <span class="font-bold text-slate-800">${datos.categoria}</span>
            </div>
        `;
    }

    // Fila de cuenta o alias de destino si existe
    let filaCuentaDestinoHTML = '';
    if (datos.cuentaDestino) {
        filaCuentaDestinoHTML = `
            <div class="flex justify-between items-center py-1.5 text-xs">
                <span class="text-slate-400 font-medium">Cuenta destino</span>
                <span class="font-bold text-slate-700 break-all text-right max-w-[180px]">${datos.cuentaDestino}</span>
            </div>
        `;
    }

    // Fila con el nombre de quien recibe
    const nombreDestino = datos.destinatario || 'Destinatario';

    // Armo el HTML del modal flotante
    const modalHTML = `
    <div id="modalComprobante" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 opacity-0 transition-opacity duration-300">
        <div id="contenedorModalComprobante" class="w-full max-w-[360px] flex flex-col items-center transform scale-95 transition-transform duration-300">
            
            <!-- Tarjeta del ticket (esto es lo que se convierte a PDF) -->
            <div id="ticketComprobante" class="w-full bg-white rounded-[28px] p-6 shadow-2xl border border-slate-100 flex flex-col relative overflow-hidden">
                
                <!-- Encabezado con Logo -->
                <div class="flex items-center justify-center gap-2 mb-4">
                    <img src="${logoSrc}" alt="AlkyWall Logo" class="w-7 h-7 object-contain">
                    <span class="text-slate-900 text-base font-extrabold font-['Plus_Jakarta_Sans',sans-serif]">Alky<span class="text-blue-600">Wall</span></span>
                </div>

                <!-- Tilde verde y estado -->
                <div class="flex flex-col items-center text-center mb-4">
                    <div class="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-500 flex items-center justify-center text-xl mb-2 shadow-sm">
                        <i class="fa-solid fa-check"></i>
                    </div>
                    <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50/70 px-3 py-0.5 rounded-full mb-1">
                        Comprobante Oficial
                    </span>
                    <h3 class="text-sm font-extrabold text-slate-800">${tituloTipo}</h3>
                    <p class="text-[11px] text-slate-400 font-medium">${fechaTexto}</p>
                </div>

                <!-- Monto debitado -->
                <div class="w-full bg-slate-50 rounded-2xl p-4 text-center border border-slate-100 mb-4">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Monto total</span>
                    <span class="text-2xl font-extrabold text-slate-900 tracking-tight">-$ ${montoFormateado}</span>
                </div>

                <!-- Línea punteada separadora estilo ticket -->
                <div class="border-b border-dashed border-slate-200 my-1"></div>

                <!-- Detalles de la operación -->
                <div class="py-2 flex flex-col divide-y divide-slate-100/80">
                    <div class="flex justify-between items-center py-1.5 text-xs">
                        <span class="text-slate-400 font-medium">Destinatario</span>
                        <span class="font-bold text-slate-800 text-right max-w-[180px]">${nombreDestino}</span>
                    </div>

                    ${filaCuentaDestinoHTML}
                    ${filaCategoriaHTML}

                    <div class="flex justify-between items-center py-1.5 text-xs">
                        <span class="text-slate-400 font-medium">Nro. de Operación</span>
                        <span class="font-mono font-bold text-slate-600 text-[11px]">${nroOperacion}</span>
                    </div>

                    <div class="flex justify-between items-center py-1.5 text-xs">
                        <span class="text-slate-400 font-medium">Estado</span>
                        <span class="font-bold text-emerald-600 flex items-center gap-1">
                            <i class="fa-solid fa-circle-check text-[10px]"></i> Acreditado
                        </span>
                    </div>
                </div>

                <!-- Pie de ticket -->
                <div class="mt-4 pt-3 border-t border-slate-100 text-center">
                    <p class="text-[10px] text-slate-400 font-medium">
                        Operación procesada con éxito a través de <strong class="text-slate-600 font-bold">AlkyWall</strong>.
                    </p>
                </div>
            </div>

            <!-- Botones de Acción (Fuera del ticket para no salir en el PDF) -->
            <div class="w-full flex flex-col gap-2 mt-4 px-1">
                <button id="btnDescargarPDF" class="w-full h-12 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer">
                    <i class="fa-solid fa-file-pdf text-base"></i>
                    <span>Descargar comprobante en PDF</span>
                </button>

                <div class="flex gap-2">
                    <button id="btnCompartirComprobante" class="flex-1 h-11 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-xs hover:bg-slate-50 transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer">
                        <i class="fa-solid fa-share-nodes text-blue-600"></i>
                        <span>Compartir</span>
                    </button>
                    <button id="btnCerrarComprobante" class="flex-1 h-11 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-200 transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer">
                        <i class="fa-solid fa-xmark"></i>
                        <span>Cerrar</span>
                    </button>
                </div>
            </div>

        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('modalComprobante');
    const contenedor = document.getElementById('contenedorModalComprobante');
    const btnCerrar = document.getElementById('btnCerrarComprobante');
    const btnDescargar = document.getElementById('btnDescargarPDF');
    const btnCompartir = document.getElementById('btnCompartirComprobante');

    // Animación suave de entrada
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        contenedor.classList.remove('scale-95');
    }, 10);

    // Función para cerrar el modal
    const cerrar = () => {
        modal.classList.add('opacity-0');
        contenedor.classList.add('scale-95');
        setTimeout(() => modal.remove(), 300);
    };

    btnCerrar.addEventListener('click', cerrar);

    // Cierra si hace clic en el fondo oscuro
    modal.addEventListener('click', (e) => {
        if (e.target === modal) cerrar();
    });

    // Acción para descargar el PDF
    btnDescargar.addEventListener('click', async () => {
        const textoOriginal = btnDescargar.innerHTML;
        btnDescargar.disabled = true;
        btnDescargar.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i><span>Generando PDF...</span>`;

        try {
            await cargarLibreriaPDF();
            const elementoTicket = document.getElementById('ticketComprobante');

            const opciones = {
                margin: [10, 10, 10, 10],
                filename: `comprobante-${nroOperacion.toLowerCase()}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: false },
                jsPDF: { unit: 'mm', format: [100, 160], orientation: 'portrait' }
            };

            await window.html2pdf().set(opciones).from(elementoTicket).save();
        } catch (error) {
            console.error('Error al generar PDF:', error);
            alert('No se pudo generar el PDF. Puedes tomar una captura de pantalla.');
        } finally {
            btnDescargar.disabled = false;
            btnDescargar.innerHTML = textoOriginal;
        }
    });

    // Acción para compartir en celular o copiar en PC
    btnCompartir.addEventListener('click', async () => {
        const textoCompartir = `Comprobante AlkyWall - ${tituloTipo}\nMonto: $ ${montoFormateado}\nDestino: ${nombreDestino}\nOperación: ${nroOperacion}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Comprobante AlkyWall - ${nroOperacion}`,
                    text: textoCompartir
                });
            } catch (err) {
                // Si el usuario cancela la ventana de compartir, no mostramos error
            }
        } else {
            // Si está en PC, le copia el detalle al portapapeles
            try {
                await navigator.clipboard.writeText(textoCompartir);
                const original = btnCompartir.innerHTML;
                btnCompartir.innerHTML = `<i class="fa-solid fa-check text-emerald-500"></i><span>¡Copiado!</span>`;
                setTimeout(() => { btnCompartir.innerHTML = original; }, 2000);
            } catch (e) {
                alert(textoCompartir);
            }
        }
    });
}

// También lo dejo disponible en window por si se llama desde scripts no-módulos
if (typeof window !== 'undefined') {
    window.mostrarComprobanteModal = mostrarComprobanteModal;
}
