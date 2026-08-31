document.addEventListener('DOMContentLoaded', () => {


    // LÓGICA DE BÚSQUEDA

    const inputBusqueda = document.getElementById('inputBusquedaContactos');
    const itemsContacto = document.querySelectorAll('.contacto-item');
    const msgSinResultados = document.getElementById('msgSinResultados');

    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', (e) => {
            const termino = e.target.value.toLowerCase().trim();
            let visibles = 0;

            itemsContacto.forEach(item => {
                const nombre = item.querySelector('.contacto-nombre').innerText.toLowerCase();
                const alias = item.querySelector('.contacto-alias').innerText.toLowerCase();

                if (nombre.includes(termino) || alias.includes(termino)) {
                    item.style.display = 'flex';
                    visibles++;
                } else {
                    item.style.display = 'none';
                }
            });

            // Mostrar mensaje si no hay resultados
            if (visibles === 0) {
                msgSinResultados.classList.remove('hidden');
                msgSinResultados.classList.add('flex');
            } else {
                msgSinResultados.classList.add('hidden');
                msgSinResultados.classList.remove('flex');
            }
        });
    }


    // LÓGICA DEL BOTÓN VOLVER

    const btnVolver = document.getElementById('btnVolver');
    if (btnVolver) {
        btnVolver.addEventListener('click', () => {
            document.body.classList.add('opacity-0');
            setTimeout(() => {
                window.history.back(); 
            }, 100);
        });
    }


    // LÓGICA DEL MODAL NUEVO CONTACTO

    const btnNuevoContacto = document.getElementById('btnNuevoContacto');
    const modalNuevaCuenta = document.getElementById('modalNuevaCuenta');
    const btnCerrarModalCuenta = document.getElementById('btnCerrarModalCuenta');
    const modalNuevaCuentaContent = document.getElementById('modalNuevaCuentaContent');
    const btnGuardarModalCuenta = document.getElementById('btnGuardarModalCuenta');

    if (btnNuevoContacto && modalNuevaCuenta) {
        
        // Abrir Modal
        btnNuevoContacto.addEventListener('click', (e) => {
            e.preventDefault();
            modalNuevaCuenta.classList.remove('hidden');
            setTimeout(() => {
                modalNuevaCuenta.classList.remove('opacity-0');
                modalNuevaCuentaContent.classList.remove('translate-y-full');
            }, 10);
        });

        // Cerrar Modal
        const cerrarModal = () => {
            modalNuevaCuenta.classList.add('opacity-0');
            modalNuevaCuentaContent.classList.add('translate-y-full');
            setTimeout(() => {
                modalNuevaCuenta.classList.add('hidden');
            }, 300);
        };

        btnCerrarModalCuenta.addEventListener('click', cerrarModal);

        modalNuevaCuenta.addEventListener('click', (e) => {
            if (e.target === modalNuevaCuenta) {
                cerrarModal();
            }
        });

        // Guardar Contacto (Simulado)
        btnGuardarModalCuenta.addEventListener('click', () => {
            const alias = document.getElementById('inputModalCbu').value;
            const nombre = document.getElementById('inputModalNombre').value;

            console.log("=== NUEVO CONTACTO AGENDADO DESDE AGENDA ===");
            console.log("Alias:", alias);
            console.log("Nombre:", nombre);

            btnGuardarModalCuenta.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Guardando...`;
            
            setTimeout(() => {
                btnGuardarModalCuenta.innerHTML = `Guardar Contacto`;
                cerrarModal();
                document.getElementById('inputModalCbu').value = '';
                document.getElementById('inputModalNombre').value = '';
                // Aquí en la vida real recargarías la lista o harías appendChild
            }, 1000);
        });
    }


    // LÓGICA DE ELIMINAR CONTACTO

    const botonesEliminar = document.querySelectorAll('.btn-eliminar-contacto');
    const modalEliminarContacto = document.getElementById('modalEliminarContacto');
    const modalEliminarContactoContent = document.getElementById('modalEliminarContactoContent');
    const nombreContactoAEliminar = document.getElementById('nombreContactoAEliminar');
    const btnCancelarEliminar = document.getElementById('btnCancelarEliminar');
    const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');

    let contactoTarget = null; // Almacena qué div de contacto se va a eliminar

    if (modalEliminarContacto) {
        
        const cerrarModalEliminar = () => {
            modalEliminarContacto.classList.add('opacity-0');
            modalEliminarContactoContent.classList.add('scale-95');
            setTimeout(() => {
                modalEliminarContacto.classList.add('hidden');
                contactoTarget = null;
            }, 300);
        };

        // Abrir Modal
        botonesEliminar.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Prevenir que el click se propague si estuviera dentro de un <a>
                e.preventDefault(); 
                
                // Encontrar la tarjeta padre
                contactoTarget = btn.closest('.contacto-item');
                const nombreContacto = contactoTarget.querySelector('.contacto-nombre').innerText;
                
                // Setear nombre en el modal
                nombreContactoAEliminar.innerText = nombreContacto;

                // Mostrar modal
                modalEliminarContacto.classList.remove('hidden');
                setTimeout(() => {
                    modalEliminarContacto.classList.remove('opacity-0');
                    modalEliminarContactoContent.classList.remove('scale-95');
                }, 10);
            });
        });

        // Cancelar
        btnCancelarEliminar.addEventListener('click', cerrarModalEliminar);
        modalEliminarContacto.addEventListener('click', (e) => {
            if (e.target === modalEliminarContacto) {
                cerrarModalEliminar();
            }
        });

        // Confirmar Eliminación
        btnConfirmarEliminar.addEventListener('click', () => {
            if (contactoTarget) {
                // Muestra un estado de cargando
                btnConfirmarEliminar.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
                
                // Simulación de delay de API
                setTimeout(() => {
                    // Cerrar modal
                    cerrarModalEliminar();
                    
                    // Restablecer texto del botón
                    setTimeout(() => {
                        btnConfirmarEliminar.innerHTML = `Sí, eliminar`;
                    }, 300);

                    // Animación 1: Desvanecer la tarjeta
                    contactoTarget.style.transition = "all 0.3s ease";
                    contactoTarget.style.opacity = "0";
                    contactoTarget.style.transform = "scale(0.95)";
                    
                    // Animación 2: Colapsar el espacio para que los de abajo suban suavemente
                    setTimeout(() => {
                        contactoTarget.style.transition = "all 0.3s ease";
                        contactoTarget.style.height = "0px";
                        contactoTarget.style.padding = "0px";
                        contactoTarget.style.margin = "0px";
                        contactoTarget.style.border = "none";
                        contactoTarget.style.overflow = "hidden";
                    }, 200);

                    // Finalmente, eliminar del DOM
                    setTimeout(() => {
                        contactoTarget.remove();
                    }, 500);
                    
                }, 800);
            }
        });
    }

});
