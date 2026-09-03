const axiosInstance = typeof axios !== 'undefined' ? axios.create({
    baseURL: "http://localhost:8080/api",
    timeout: 5000,
    headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json"
    },
}) : null;
const getUser = async () => {
    if (!axiosInstance) return null;
    try {
        const response = await axiosInstance.get("/user/current");
        return response.data;
    }
    catch (error) {
        console.error(error);
        window.location.href = "../dashboard/indexDashboard.html"
        return null;
    }
}

document.addEventListener('DOMContentLoaded', async () => {

    const nombreUsuario = document.getElementById('nombreUsuario');
    const emailUsuario = document.getElementById('emailUsuario');
    const dniUsuario = document.getElementById('dniUsuario');
    const btnCopiarCVU = document.getElementById('btnCopiarCVU');
    const cvuUsuario = document.getElementById('cvuUsuario');
    const btnCopiarAlias = document.getElementById('btnCopiarAlias');
    const aliasUsuario = document.getElementById('aliasUsuario');
    const toastCopiar = document.getElementById('toastCopiar');
    let toastTimeout;

    //Mostrar información del usuario
    const user = (await getUser());
    nombreUsuario.innerText = user.data.firstName + user.data.lastName.charAt(0).toUpperCase();;
    emailUsuario.innerText = user.data.email;
    cvuUsuario.innerText = user.data.account.accountNumber;
    aliasUsuario.innerText = user.data.account.alias;
    dniUsuario.innerText = user.data.dni;
    
    

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
