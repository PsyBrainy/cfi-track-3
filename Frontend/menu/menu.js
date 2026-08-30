document.addEventListener('DOMContentLoaded', () => {
    // 1. Definimos el HTML del menú desplegable
    const menuHTML = `
        <!-- Overlay del Menú (Fondo oscurecido) -->
        <div id="menu-overlay" class="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-40 opacity-0 pointer-events-none transition-opacity duration-300"></div>
        
        <!-- Menú Lateral (Drawer) -->
        <aside id="menu-drawer" class="absolute top-0 left-0 h-full w-[260px] bg-white z-50 transform -translate-x-full transition-transform duration-300 ease-in-out shadow-[10px_0_40px_rgba(0,0,0,0.1)] flex flex-col">
            <!-- Menú Header -->
            <div class="flex justify-between items-center p-6 border-b border-slate-100">
                <div class="flex items-center gap-2">
                    <img src="../assets/logo.png" alt="AlkyWall Logo" class="w-7 h-7 object-contain">
                    <span class="text-slate-900 text-base font-extrabold font-['Plus_Jakarta_Sans',sans-serif]">Alky<span class="text-blue-600">Wall</span></span>
                </div>
                <button id="close-menu-btn" class="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition">
                    <i class="fa-solid fa-xmark text-lg"></i>
                </button>
            </div>
            
            <!-- Menú Links (Gestión y Seguridad) -->
            <nav class="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
                <a href="#" class="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium text-xs transition page-transition">
                    <i class="fa-solid fa-clock-rotate-left w-5 text-center text-sm"></i> Historial
                </a>
                <a href="#" class="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium text-xs transition page-transition">
                    <i class="fa-solid fa-shield-halved w-5 text-center text-sm"></i> Seguridad
                </a>
                <a href="#" class="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium text-xs transition page-transition">
                    <i class="fa-solid fa-headset w-5 text-center text-sm"></i> Centro de Ayuda
                </a>
                <a href="../configuracion/indexConfiguracion.html" class="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium text-xs transition page-transition">
                    <i class="fa-solid fa-gear w-5 text-center text-sm"></i> Configuración
                </a>
            </nav>
            
            <!-- Menú Footer -->
            <div class="p-6 border-t border-slate-100">
                <a href="../login/indexLogin.html" class="flex items-center gap-3 text-red-500 hover:text-red-600 font-bold text-xs transition page-transition">
                    <i class="fa-solid fa-arrow-right-from-bracket w-5 text-center text-sm"></i> Cerrar Sesión
                </a>
            </div>
        </aside>
    `;

    // 2. Inyectar el menú dentro de la etiqueta <main> (para que respete los bordes de la "pantalla")
    const mainContainer = document.querySelector('main');
    if (mainContainer) {
        mainContainer.insertAdjacentHTML('afterbegin', menuHTML);
    }

    // 3. Lógica de abrir/cerrar
    const openBtn = document.getElementById('open-menu-btn');
    const closeBtn = document.getElementById('close-menu-btn');
    const overlay = document.getElementById('menu-overlay');
    const drawer = document.getElementById('menu-drawer');

    function openMenu() {
        if(overlay && drawer) {
            overlay.classList.remove('opacity-0', 'pointer-events-none');
            drawer.classList.remove('-translate-x-full');
        }
    }

    function closeMenu() {
        if(overlay && drawer) {
            overlay.classList.add('opacity-0', 'pointer-events-none');
            drawer.classList.add('-translate-x-full');
        }
    }

    // Escuchar los clics
    if (openBtn) openBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);
});
