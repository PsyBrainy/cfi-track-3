/**
 * Hola, hola! acá hay un ejemplo de cómo generar los componentes dinámicamente
 * cuando leas los datos desde el Backend
 *
 * Actualmente los datos están hardcodeados
 * para que podamos ver y ajustar el diseño.
 * Cuando conectes los datos reales, los borramos
 *
 * CONTACTOS RECIENTES
 * ----------------------------------------------------------------------------
 * function cargarContactosRecientes(contactosBD) {
 *     const contenedor = document.getElementById('listaContactos');
 *
 *     contactosBD.forEach(contacto => {
 *         const tarjetaHTML = `
 *             <button class="min-w-[76px] h-[92px] rounded-[20px] bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition">
 *                 <div class="w-[38px] h-[38px] rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shadow-inner">
 *                     ${contacto.iniciales}
 *                 </div>
 *                 <span class="text-[10px] text-slate-600 font-semibold">${contacto.nombre}</span>
 *             </button>
 *         `;
 *         contenedor.innerHTML += tarjetaHTML;
 *     });
 * }
 */

/**
 * ----------------------------------------------------------------------------
 * HISTORIAL DE MOVIMIENTOS
 * ----------------------------------------------------------------------------
 * function cargarMovimientos(movimientosBD) {
 *     const contenedor = document.getElementById('listaMovimientos');
 *
 *     movimientosBD.forEach(mov => {
 *         // Pequeña lógica para diferenciar ingresos de egresos
 *         const esIngreso = mov.monto > 0;
 *         const colorMonto = esIngreso ? 'text-blue-600' : 'text-slate-800';
 *         const signo = esIngreso ? '+' : '-';
 *         const montoFormateado = Math.abs(mov.monto).toLocaleString('es-AR', { minimumFractionDigits: 2 });
 *
 *         const movimientoHTML = `
 *             <div class="p-4 rounded-[20px] bg-white border border-slate-200 shadow-sm flex items-center justify-between hover:bg-slate-50 transition cursor-pointer">
 *                 <div class="flex items-center gap-3">
 *                     <!-- En un caso real, los colores e íconos dependerán de la categoría del movimiento -->
 *                     <div class="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-500 bg-slate-50">
 *                         <i class="${mov.iconoClase} text-sm"></i>
 *                     </div>
 *                     <div>
 *                         <p class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
 *                             ${mov.titulo} <span class="w-1 h-1 bg-slate-400 rounded-full"></span>
 *                         </p>
 *                         <p class="text-[10px] text-slate-500 mt-0.5">${mov.descripcion}</p>
 *                     </div>
 *                 </div>
 *                 <span class="text-xs font-bold ${colorMonto} tracking-wide">${signo} $ ${montoFormateado}</span>
 *             </div>
 *         `;
 *
 *         contenedor.innerHTML += movimientoHTML;
 *     });
 * }
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // LÓGICA DEL MODAL NUEVA CUENTA
    // ==========================================
    const btnNuevaCuenta = document.getElementById('btnNuevaCuentaDashboard');
    const modalNuevaCuenta = document.getElementById('modalNuevaCuenta');
    const btnCerrarModalCuenta = document.getElementById('btnCerrarModalCuenta');
    const modalNuevaCuentaContent = document.getElementById('modalNuevaCuentaContent');
    const btnGuardarModalCuenta = document.getElementById('btnGuardarModalCuenta');

    if (btnNuevaCuenta && modalNuevaCuenta) {

        // Abrir Modal
        btnNuevaCuenta.addEventListener('click', (e) => {
            e.preventDefault();
            modalNuevaCuenta.classList.remove('hidden');
            // Pequeño delay para que la transición de opacidad/transformación funcione
            setTimeout(() => {
                modalNuevaCuenta.classList.remove('opacity-0');
                modalNuevaCuentaContent.classList.remove('translate-y-full');
            }, 10);
        });

        // Cerrar Modal (función reutilizable)
        const cerrarModal = () => {
            modalNuevaCuenta.classList.add('opacity-0');
            modalNuevaCuentaContent.classList.add('translate-y-full');
            setTimeout(() => {
                modalNuevaCuenta.classList.add('hidden');
            }, 300); // Esperar que termine la transición de CSS
        };

        // Cerrar al tocar la cruz
        btnCerrarModalCuenta.addEventListener('click', cerrarModal);

        // Cerrar al tocar el fondo oscuro (backdrop)
        modalNuevaCuenta.addEventListener('click', (e) => {
            if (e.target === modalNuevaCuenta) {
                cerrarModal();
            }
        });

        // Lógica de Guardar Contacto (Simulada por ahora)
        btnGuardarModalCuenta.addEventListener('click', () => {
            const alias = document.getElementById('inputModalCbu').value;
            const nombre = document.getElementById('inputModalNombre').value;

            console.log("=== NUEVO CONTACTO AGENDADO DESDE DASHBOARD ===");
            console.log("Alias:", alias);
            console.log("Nombre:", nombre);

            btnGuardarModalCuenta.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Guardando...`;

            // Simular petición al backend
            setTimeout(() => {
                btnGuardarModalCuenta.innerHTML = `Guardar Contacto`;
                cerrarModal();
                // Limpiar inputs
                document.getElementById('inputModalCbu').value = '';
                document.getElementById('inputModalNombre').value = '';
            }, 1000);
        });
    }

});

// Se activa al cargar la página
addEventListener("DOMContentLoaded", (event) => onInit(event));
// Clase que almacenará los datos de la cuenta
class AccountData {
    constructor(balance, accountNumber, currency, alias, isActive){
        this.balance = balance;
        this.accountNumber = accountNumber;
        this.currency = currency;
        this.alias = alias;
        this.isActive = isActive;
    }
}
// Función asíncrona que se ejcuta al cargar la página se encarga de comprobar
// si hay o no un token y en caso de no haberlo o ser inválido redirige a login
async function onInit(event) {
    const token = localStorage.getItem("token");
    if (token != null) {
        let accountData = await getAccount();
        mostrarInfo(accountData);
    } else {
        window.location.href = "../login/indexLogin.html"
    }
}
// Instancia para poder realizar peticiones HTTP
const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    timeout: 5000,
    headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json"
    },
});
const getAccount = async () => {
    try {
        const response = await axiosInstance
            .get("/account");
        return response.data;
    }
    catch (error) {
        window.location.href= "../login/indexLogin.html";
        console.error(error);
    }
    finally {
        console.log("Request completed");
    };
}
function mostrarInfo(accountData){
    balance = document.getElementById('balance');
    welcome = document.getElementById('welcome');
    balance.textContent = accountData.balance + " " + accountData.currency;
}
function mostrarMensaje(texto, elemento) {
    elemento.textContent = texto;
    elemento.style.display = "block"
}
function ocultarMensaje(elemento) {
    elemento.textContent = '';
    elemento.style.display = "none";
}