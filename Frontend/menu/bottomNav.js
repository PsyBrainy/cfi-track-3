document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const isDashboard = path.includes('indexDashboard.html');
    const isPerfil = path.includes('indexPerfil.html');
    const isTransferencia = path.includes('indexTransferencia.html');
    const isContactos = path.includes('indexContactos.html');

    const bottomNavHTML = `
        <!-- Botonera Inferior Flotante -->
        <nav class="absolute bottom-0 left-0 w-full bg-white md:rounded-b-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-6 pt-4 px-2 z-40 border-t border-slate-100">
            <ul class="flex justify-between items-end relative">
                <!-- Inicio -->
                <li class="flex-1 flex justify-center">
                    <a href="../dashboard/indexDashboard.html" class="flex flex-col items-center gap-1.5 ${isDashboard ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'} transition page-transition">
                        <i class="fa-solid fa-house text-[1.3rem]"></i>
                        <span class="text-[9px] font-bold">Inicio</span>
                    </a>
                </li>
                
                <!-- Transferir -->
                <li class="flex-1 flex justify-center">
                    <a href="../transferencia/indexTransferencia.html" class="flex flex-col items-center gap-1.5 ${isTransferencia ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'} transition page-transition">
                        <i class="fa-solid fa-arrow-right-arrow-left text-[1.3rem]"></i>
                        <span class="text-[9px] font-bold">Transferir</span>
                    </a>
                </li>
                
                <!-- QR Botón Flotante -->
                <li class="flex-1 flex justify-center relative">
                    <button id="btnFlotanteQR" class="absolute -top-12 left-1/2 -translate-x-1/2 w-[60px] h-[60px] bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_rgba(37,99,235,0.4)] border-[5px] border-[#f0f6ff] transition transform hover:scale-105 active:scale-95 z-50">
                        <i class="fa-solid fa-qrcode text-2xl"></i>
                    </button>
                    <div class="h-6"></div>
                </li>

                <!-- Contactos -->
                <li class="flex-1 flex justify-center">
                    <a href="../contactos/indexContactos.html" class="flex flex-col items-center gap-1.5 ${isContactos ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'} transition page-transition">
                        <i class="fa-solid fa-address-book text-[1.3rem]"></i>
                        <span class="text-[9px] font-bold">Contactos</span>
                    </a>
                </li>
                
                <!-- Perfil -->
                <li class="flex-1 flex justify-center">
                    <a href="../perfil/indexPerfil.html" class="flex flex-col items-center gap-1.5 ${isPerfil ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'} transition">
                        <i class="fa-regular fa-user text-[1.3rem]"></i>
                        <span class="text-[9px] font-bold">Perfil</span>
                    </a>
                </li>
            </ul>
        </nav>

        <!-- Action Sheet QR -->
        <div id="modalMenuQR" class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-end justify-center hidden opacity-0 transition-opacity duration-300 md:rounded-[32px] overflow-hidden">
            <div id="modalMenuQRContent" class="bg-white w-full rounded-t-[32px] p-6 pb-10 shadow-2xl transform translate-y-full transition-transform duration-300 flex flex-col gap-4 relative">
                <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-2"></div>
                <h3 class="text-lg font-extrabold text-slate-900 text-center mb-2">¿Qué deseas hacer?</h3>
                
                <a href="../qr/indexPagar.html" class="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-4 hover:bg-blue-50 hover:border-blue-100 transition page-transition group">
                    <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                        <i class="fa-solid fa-camera"></i>
                    </div>
                    <div class="flex flex-col">
                        <span class="font-bold text-slate-800">Pagar con QR</span>
                        <span class="text-xs font-medium text-slate-500">Escanea un código para pagar</span>
                    </div>
                    <i class="fa-solid fa-chevron-right ml-auto text-slate-300"></i>
                </a>

                <a href="../qr/indexCobrar.html" class="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-4 hover:bg-blue-50 hover:border-blue-100 transition page-transition group">
                    <div class="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                        <i class="fa-solid fa-hand-holding-dollar"></i>
                    </div>
                    <div class="flex flex-col">
                        <span class="font-bold text-slate-800">Cobrar con QR</span>
                        <span class="text-xs font-medium text-slate-500">Genera un código para recibir</span>
                    </div>
                    <i class="fa-solid fa-chevron-right ml-auto text-slate-300"></i>
                </a>
            </div>
        </div>
    `;

    const mainContainer = document.querySelector('main');
    if (mainContainer) {
        mainContainer.insertAdjacentHTML('beforeend', bottomNavHTML);
        mainContainer.style.paddingBottom = '5.5rem';

        // Lógica del Action Sheet QR
        const btnFlotanteQR = document.getElementById('btnFlotanteQR');
        const modalMenuQR = document.getElementById('modalMenuQR');
        const modalMenuQRContent = document.getElementById('modalMenuQRContent');

        if (btnFlotanteQR && modalMenuQR) {
            btnFlotanteQR.addEventListener('click', (e) => {
                e.preventDefault();
                modalMenuQR.classList.remove('hidden');
                // Timeout para permitir que el display:block se aplique antes de animar opacidad
                setTimeout(() => {
                    modalMenuQR.classList.remove('opacity-0');
                    modalMenuQRContent.classList.remove('translate-y-full');
                }, 10);
            });

            // Cerrar al tocar el fondo
            modalMenuQR.addEventListener('click', (e) => {
                if(e.target === modalMenuQR) {
                    cerrarModalMenuQR();
                }
            });

            function cerrarModalMenuQR() {
                modalMenuQR.classList.add('opacity-0');
                modalMenuQRContent.classList.add('translate-y-full');
                setTimeout(() => {
                    modalMenuQR.classList.add('hidden');
                }, 300);
            }
        }
    }
});
