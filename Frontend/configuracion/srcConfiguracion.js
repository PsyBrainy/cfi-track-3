// Configuramos axios con el token
const axiosConfigInstance = typeof axios !== 'undefined' ? axios.create({
    baseURL: "http://localhost:8080/api",
    timeout: 5000,
    headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json"
    }
}) : null;

document.addEventListener('DOMContentLoaded', async () => {
    const aliasActualConfig = document.getElementById('aliasActualConfig');
    const btnCopiarAliasConfig = document.getElementById('btnCopiarAliasConfig');
    const btnCambiarAlias = document.getElementById('btnCambiarAlias');
    const btnAbrirModalAlias = document.getElementById('btnAbrirModalAlias');
    const modalCambiarAlias = document.getElementById('modalCambiarAlias');
    const modalCambiarAliasContent = document.getElementById('modalCambiarAliasContent');
    const btnCerrarModalAlias = document.getElementById('btnCerrarModalAlias');
    const btnCancelarModalAlias = document.getElementById('btnCancelarModalAlias');
    const btnGuardarModalAlias = document.getElementById('btnGuardarModalAlias');
    const inputNuevoAlias = document.getElementById('inputNuevoAlias');
    const aliasErrorMsg = document.getElementById('aliasErrorMsg');
    const toastConfig = document.getElementById('toastConfig');
    const toastConfigMsg = document.getElementById('toastConfigMsg');
    const toastConfigIcon = document.getElementById('toastConfigIcon');
    let toastTimeout;

    // Toast flotante para avisos
    const mostrarToast = (mensaje, esError = false) => {
        if (!toastConfig) return;
        clearTimeout(toastTimeout);
        toastConfigMsg.innerText = mensaje;
        if (esError) {
            toastConfigIcon.className = "fa-solid fa-circle-exclamation text-red-400 text-sm";
        } else {
            toastConfigIcon.className = "fa-solid fa-circle-check text-green-400 text-sm";
        }
        toastConfig.classList.remove('opacity-0');
        toastConfig.classList.add('opacity-100');
        toastTimeout = setTimeout(() => {
            toastConfig.classList.remove('opacity-100');
            toastConfig.classList.add('opacity-0');
        }, 2500);
    };

    // Cargamos los datos reales del usuario logueado
    let aliasActual = "";
    const cargarUsuario = async () => {
        if (!axiosConfigInstance) return;
        try {
            const res = await axiosConfigInstance.get("/user/current");
            if (res.data && res.data.data && res.data.data.account) {
                aliasActual = res.data.data.account.alias || "";
                if (aliasActualConfig) {
                    aliasActualConfig.innerText = aliasActual;
                }
            }
        } catch (error) {
            console.error("Error al obtener usuario:", error);
            if (aliasActualConfig) {
                aliasActualConfig.innerText = "No disponible";
            }
        }
    };

    // Eliminar Cuenta
    const modalConfirmarEliminar = document.getElementById('modalConfirmarEliminar');
    const modalConfirmarEliminarContent = document.getElementById('modalConfirmarEliminarContent');
    const btnCerrarModalConfirmarEliminar = document.getElementById('btnCerrarModalConfirmarEliminar');
    const btnCancelarModalConfirmarEliminar = document.getElementById('btnCancelarModalConfirmarEliminar');
    const btnConfirmarEliminarCuenta = document.getElementById('btnConfirmarEliminarCuenta');

    const modalResultadoEliminar = document.getElementById('modalResultadoEliminar');
    const modalResultadoEliminarContent = document.getElementById('modalResultadoEliminarContent');
    const btnCerrarModalResultadoEliminar = document.getElementById('btnCerrarModalResultadoEliminar');
    const iconoResultadoEliminar = document.getElementById('iconoResultadoEliminar');
    const tituloResultadoEliminar = document.getElementById('tituloResultadoEliminar');
    const mensajeResultadoEliminar = document.getElementById('mensajeResultadoEliminar');

    let eliminacionExitosa = false;

    const abrirModalConfirmarEliminar = () => {
        if (!modalConfirmarEliminar) return;
        modalConfirmarEliminar.classList.remove('hidden');
        setTimeout(() => {
            modalConfirmarEliminar.classList.remove('opacity-0');
            if (modalConfirmarEliminarContent) modalConfirmarEliminarContent.classList.remove('translate-y-full');
        }, 10);
    };

    const cerrarModalConfirmarEliminar = () => {
        if (!modalConfirmarEliminar) return;
        modalConfirmarEliminar.classList.add('opacity-0');
        if (modalConfirmarEliminarContent) modalConfirmarEliminarContent.classList.add('translate-y-full');
        setTimeout(() => {
            modalConfirmarEliminar.classList.add('hidden');
        }, 300);
    };

    const mostrarResultadoEliminar = (exito, mensaje) => {
        eliminacionExitosa = exito;
        if (!modalResultadoEliminar) return;

        if (exito) {
            iconoResultadoEliminar.className = "w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-1 bg-green-50 text-green-500";
            iconoResultadoEliminar.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
            tituloResultadoEliminar.innerText = "Cuenta eliminada";
        } else {
            iconoResultadoEliminar.className = "w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-1 bg-red-50 text-red-500";
            iconoResultadoEliminar.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>';
            tituloResultadoEliminar.innerText = "No pudimos eliminar tu cuenta";
        }
        mensajeResultadoEliminar.innerText = mensaje;

        modalResultadoEliminar.classList.remove('hidden');
        setTimeout(() => {
            modalResultadoEliminar.classList.remove('opacity-0');
            if (modalResultadoEliminarContent) modalResultadoEliminarContent.classList.remove('translate-y-full');
        }, 10);
    };

    const cerrarModalResultadoEliminar = () => {
        if (!modalResultadoEliminar) return;
        modalResultadoEliminar.classList.add('opacity-0');
        if (modalResultadoEliminarContent) modalResultadoEliminarContent.classList.add('translate-y-full');
        setTimeout(() => {
            modalResultadoEliminar.classList.add('hidden');
            // Si la eliminación fue exitosa, ahora sí redirigimos al login
            if (eliminacionExitosa) {
                window.location.href = "../login/indexLogin.html";
            }
        }, 300);
    };

    if (btnCerrarModalConfirmarEliminar) btnCerrarModalConfirmarEliminar.addEventListener('click', cerrarModalConfirmarEliminar);
    if (btnCancelarModalConfirmarEliminar) btnCancelarModalConfirmarEliminar.addEventListener('click', cerrarModalConfirmarEliminar);
    if (modalConfirmarEliminar) {
        modalConfirmarEliminar.addEventListener('click', (e) => {
            if (e.target === modalConfirmarEliminar) cerrarModalConfirmarEliminar();
        });
    }
    if (btnCerrarModalResultadoEliminar) btnCerrarModalResultadoEliminar.addEventListener('click', cerrarModalResultadoEliminar);
    if (modalResultadoEliminar) {
        modalResultadoEliminar.addEventListener('click', (e) => {
            if (e.target === modalResultadoEliminar) cerrarModalResultadoEliminar();
        });
    }

    if (btnConfirmarEliminarCuenta) {
        btnConfirmarEliminarCuenta.addEventListener('click', async () => {
            const textoOriginal = btnConfirmarEliminarCuenta.innerHTML;
            btnConfirmarEliminarCuenta.disabled = true;
            btnConfirmarEliminarCuenta.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Eliminando...';

            try {
                const response = await axiosConfigInstance.post(`/user/block/current`);
                cerrarModalConfirmarEliminar();
                setTimeout(() => {
                    mostrarResultadoEliminar(true, "Tu cuenta fue eliminada correctamente. Serás redirigido al inicio de sesión.");
                }, 300);
            } catch (error) {
                console.error("Error al eliminar cuenta:", error);
                const msg = error.response?.data?.message || "Ocurrió un error al eliminar tu cuenta. Intentá nuevamente.";
                cerrarModalConfirmarEliminar();
                setTimeout(() => {
                    mostrarResultadoEliminar(false, msg);
                }, 300);
            } finally {
                btnConfirmarEliminarCuenta.disabled = false;
                btnConfirmarEliminarCuenta.innerHTML = textoOriginal;
            }
        });
    }

    // Copiar alias al portapapeles
    const copiarAlias = async () => {
        const texto = aliasActualConfig ? aliasActualConfig.innerText.trim() : "";
        if (!texto || texto === "Cargando..." || texto === "No disponible") return;

        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(texto);
                mostrarToast("¡Alias copiado al portapapeles!");
                return;
            } catch (e) {
                console.warn("Fallo clipboard api:", e);
            }
        }

        // Fallback por si acaso
        try {
            const temp = document.createElement('textarea');
            temp.value = texto;
            temp.style.position = 'fixed';
            temp.style.left = '-9999px';
            document.body.appendChild(temp);
            temp.focus();
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
            mostrarToast("¡Alias copiado al portapapeles!");
        } catch (err) {
            console.error("Error al copiar:", err);
        }
    };

    if (btnCopiarAliasConfig) {
        btnCopiarAliasConfig.addEventListener('click', (e) => {
            e.stopPropagation();
            copiarAlias();
        });
    }

    // Funciones para abrir y cerrar el modal
    const abrirModal = () => {
        if (!modalCambiarAlias) return;
        if (inputNuevoAlias) {
            inputNuevoAlias.value = "";
            inputNuevoAlias.placeholder = aliasActual || "ej: mi.nuevo.alias";
        }
        if (aliasErrorMsg) {
            aliasErrorMsg.innerText = "";
            aliasErrorMsg.classList.add('hidden');
        }
        modalCambiarAlias.classList.remove('hidden');
        setTimeout(() => {
            modalCambiarAlias.classList.remove('opacity-0');
            if (modalCambiarAliasContent) modalCambiarAliasContent.classList.remove('translate-y-full');
            if (inputNuevoAlias) inputNuevoAlias.focus();
        }, 10);
    };

    const cerrarModal = () => {
        if (!modalCambiarAlias) return;
        modalCambiarAlias.classList.add('opacity-0');
        if (modalCambiarAliasContent) modalCambiarAliasContent.classList.add('translate-y-full');
        setTimeout(() => {
            modalCambiarAlias.classList.add('hidden');
        }, 300);
    };

    if (btnCambiarAlias) btnCambiarAlias.addEventListener('click', abrirModal);
    if (btnAbrirModalAlias) btnAbrirModalAlias.addEventListener('click', (e) => {
        e.stopPropagation();
        abrirModal();
    });
    if (btnCerrarModalAlias) btnCerrarModalAlias.addEventListener('click', cerrarModal);
    if (btnCancelarModalAlias) btnCancelarModalAlias.addEventListener('click', cerrarModal);
    if (modalCambiarAlias) {
        modalCambiarAlias.addEventListener('click', (e) => {
            if (e.target === modalCambiarAlias) cerrarModal();
        });
    }

    // Guardar el nuevo alias
    if (btnGuardarModalAlias) {
        btnGuardarModalAlias.addEventListener('click', async () => {
            const nuevoAlias = inputNuevoAlias ? inputNuevoAlias.value.trim().toLowerCase() : "";

            // Validaciones sencillas del lado cliente
            if (!nuevoAlias) {
                aliasErrorMsg.innerText = "Por favor ingresá un alias";
                aliasErrorMsg.classList.remove('hidden');
                return;
            }

            if (nuevoAlias.length < 4 || nuevoAlias.length > 50) {
                aliasErrorMsg.innerText = "El alias debe tener entre 4 y 50 caracteres";
                aliasErrorMsg.classList.remove('hidden');
                return;
            }

            const regex = /^[a-zA-Z0-9._-]+$/;
            if (!regex.test(nuevoAlias)) {
                aliasErrorMsg.innerText = "Solo se permiten letras, números, puntos y guiones";
                aliasErrorMsg.classList.remove('hidden');
                return;
            }

            if (nuevoAlias === aliasActual.toLowerCase()) {
                aliasErrorMsg.innerText = "El alias ingresado es el mismo que el actual";
                aliasErrorMsg.classList.remove('hidden');
                return;
            }

            // Ocultamos errores previos y mostramos carga
            aliasErrorMsg.classList.add('hidden');
            const textoOriginal = btnGuardarModalAlias.innerHTML;
            btnGuardarModalAlias.disabled = true;
            btnGuardarModalAlias.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';

            try {
                const response = await axiosConfigInstance.put("/account/alias", { alias: nuevoAlias });
                const aliasActualizado = response.data?.data || nuevoAlias;
                aliasActual = aliasActualizado;
                if (aliasActualConfig) {
                    aliasActualConfig.innerText = aliasActualizado;
                }
                cerrarModal();
                mostrarToast("¡Alias actualizado con éxito!");
            } catch (error) {
                console.error("Error al actualizar alias:", error);
                const msg = error.response?.data?.message || (error.response?.data?.data ? Object.values(error.response.data.data)[0] : "Ese alias ya está en uso");
                aliasErrorMsg.innerText = msg;
                aliasErrorMsg.classList.remove('hidden');
            } finally {
                btnGuardarModalAlias.disabled = false;
                btnGuardarModalAlias.innerHTML = textoOriginal;
            }
        });
    }

    // Permitir enviar con Enter en el input
    if (inputNuevoAlias) {
        inputNuevoAlias.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                btnGuardarModalAlias.click();
            }
        });
    }

    // Notificaciones
    const toggleBtn = document.getElementById('toggleNotificaciones');
    const toggleBola = document.getElementById('toggleBola');
    let notificacionesActivas = true; 

    if (toggleBtn && toggleBola) {
        toggleBtn.addEventListener('click', () => {
            notificacionesActivas = !notificacionesActivas;
            if (notificacionesActivas) {
                toggleBtn.classList.replace('bg-slate-300', 'bg-blue-600');
                toggleBola.classList.replace('left-[2px]', 'left-[26px]');
            } else {
                toggleBtn.classList.replace('bg-blue-600', 'bg-slate-300');
                toggleBola.classList.replace('left-[26px]', 'left-[2px]');
            }
        });
    }

    // Biometría
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
        });
    }

    // Cambiar Teléfono
    const btnCambiarTelefono = document.getElementById('btnCambiarTelefono');
    if (btnCambiarTelefono) {
        btnCambiarTelefono.addEventListener('click', () => {
            console.log("Abrir flujo para cambiar Teléfono...");
        });
    }

    // Eliminar Cuenta
    const btnEliminarCuenta = document.getElementById('btnEliminarCuenta');
    if (btnEliminarCuenta) {
        btnEliminarCuenta.addEventListener('click', abrirModalConfirmarEliminar);
    }

    // Botón Volver
    const btnVolver = document.getElementById('btnVolver');
    if (btnVolver) {
        btnVolver.addEventListener('click', () => {
            document.body.classList.add('opacity-0');
            setTimeout(() => {
                window.history.back();
            }, 100);
        });
    }
});
