document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const isDashboard = path.includes('indexDashboard.html');
    const isPerfil = path.includes('indexPerfil.html');

    const bottomNavHTML = `
        <!-- Botonera Inferior Flotante -->
        <nav class="absolute bottom-0 left-0 w-full bg-white rounded-b-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-6 pt-4 px-2 z-40 border-t border-slate-100">
            <ul class="flex justify-between items-end relative">
                <!-- Inicio -->
                <li class="flex-1 flex justify-center">
                    <a href="../dashboard/indexDashboard.html" class="flex flex-col items-center gap-1.5 ${isDashboard ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'} transition">
                        <i class="fa-solid fa-house text-[1.3rem]"></i>
                        <span class="text-[9px] font-bold">Inicio</span>
                    </a>
                </li>
                
                <!-- Transferir -->
                <li class="flex-1 flex justify-center">
                    <a href="#" class="flex flex-col items-center gap-1.5 text-slate-400 hover:text-slate-600 transition">
                        <i class="fa-solid fa-arrow-right-arrow-left text-[1.3rem]"></i>
                        <span class="text-[9px] font-bold">Transferir</span>
                    </a>
                </li>
                
                <!-- QR Botón Flotante -->
                <li class="flex-1 flex justify-center relative">
                    <button class="absolute -top-12 left-1/2 -translate-x-1/2 w-[60px] h-[60px] bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_rgba(37,99,235,0.4)] border-[5px] border-[#f0f6ff] transition transform hover:scale-105 active:scale-95 z-50">
                        <i class="fa-solid fa-qrcode text-2xl"></i>
                    </button>
                    <div class="h-6"></div>
                </li>

                <!-- Contactos -->
                <li class="flex-1 flex justify-center">
                    <a href="#" class="flex flex-col items-center gap-1.5 text-slate-400 hover:text-slate-600 transition">
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
    `;

    const mainContainer = document.querySelector('main');
    if (mainContainer) {
        mainContainer.insertAdjacentHTML('beforeend', bottomNavHTML);
        mainContainer.style.paddingBottom = '5.5rem';
    }
});
