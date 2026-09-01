document.addEventListener('DOMContentLoaded', () => {

    const btnCopiarCVU = document.getElementById('btnCopiarCVU');
    const cvuUsuario = document.getElementById('cvuUsuario');
    const btnCopiarAlias = document.getElementById('btnCopiarAlias');
    const aliasUsuario = document.getElementById('aliasUsuario');
    const toastCopiar = document.getElementById('toastCopiar');
    let toastTimeout;

    // Función para mostrar el aviso "Copiado!" flotante
    const mostrarToast = () => {
        if (!toastCopiar) return;
        clearTimeout(toastTimeout);
        toastCopiar.classList.remove('opacity-0');
        toastCopiar.classList.add('opacity-100');
        toastTimeout = setTimeout(() => {
            toastCopiar.classList.remove('opacity-100');
            toastCopiar.classList.add('opacity-0');
        }, 2500);
    };

    // Función genérica para copiar al portapapeles (con fallback para archivos locales)
    const copiarAlPortapapeles = async (textoElemento) => {
        if (!textoElemento) return;
        
        const texto = textoElemento.innerText.trim();
        
        //Intento con API Moderna (Requiere HTTPS o localhost)
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(texto);
                mostrarToast();
                return;
            } catch (err) {
                console.warn('API Moderna falló, usando método clásico...', err);
            }
        }
        
        // Metodo Clásico Fallback
        try {
            const textAreaTemporal = document.createElement('textarea');
            textAreaTemporal.value = texto;

            textAreaTemporal.style.position = 'fixed';
            textAreaTemporal.style.left = '-999999px';
            textAreaTemporal.style.top = '-999999px';
            
            document.body.appendChild(textAreaTemporal);
            textAreaTemporal.focus();
            textAreaTemporal.select();
            
            const exitoso = document.execCommand('copy');
            document.body.removeChild(textAreaTemporal);
            
            if (exitoso) {
                mostrarToast();
            } else {
                console.error('No se pudo copiar usando execCommand');
            }
        } catch (err) {
            console.error('Error crítico al copiar:', err);
        }
    };

    // Event Listeners
    if (btnCopiarCVU) {
        btnCopiarCVU.addEventListener('click', () => copiarAlPortapapeles(cvuUsuario));
    }

    if (btnCopiarAlias) {
        btnCopiarAlias.addEventListener('click', () => copiarAlPortapapeles(aliasUsuario));
    }

});
