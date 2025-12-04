document.addEventListener('DOMContentLoaded', () => {
    
    // --- VARIABLES Y SELECTORES ---
    const carrito = [];
    const listaProductos = document.querySelector('.menu-grid');
    const contenedorCarrito = document.querySelector('#carrito-items');
    const precioTotalElemento = document.querySelector('#carrito-total');
    const contadorCarrito = document.querySelector('#contador-carrito');
    
    // Sidebar
    const carritoIcono = document.querySelector('#carrito-icono');
    const carritoSidebar = document.querySelector('#carrito-sidebar');
    const carritoOverlay = document.querySelector('#carrito-overlay');
    const cerrarCarrito = document.querySelector('#cerrar-carrito');
    const btnComprar = document.querySelector('#btn-comprar');

    // --- LÓGICA DE FILTRADO (Manteniendo tu código original) ---
    const filtroBotones = document.querySelectorAll('.filtro-btn');
    const tarjetaMenu = document.querySelectorAll('.plato-card');

    const filterMenu = (selectedCategory) => {
        filtroBotones.forEach(button => {
            if (button.dataset.category === selectedCategory) {
                button.classList.add('activo');
            } else {
                button.classList.remove('activo');
            }
        });

        tarjetaMenu.forEach(card => {
            const categoriaTarjeta = card.dataset.category;
            if (categoriaTarjeta === selectedCategory) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    };

    filtroBotones.forEach(button => {
        button.addEventListener('click', () => {
            filterMenu(button.dataset.category);
        });
    });
    // Inicializar filtro
    filterMenu('pollo');


    // --- LÓGICA DEL CARRITO ---

    // 1. Abrir/Cerrar Carrito
    const toggleCarrito = () => {
        carritoSidebar.classList.toggle('abierto');
        carritoOverlay.classList.toggle('abierto');
    };

    carritoIcono.addEventListener('click', toggleCarrito);
    cerrarCarrito.addEventListener('click', toggleCarrito);
    carritoOverlay.addEventListener('click', toggleCarrito);

    // 2. Agregar producto al hacer click
    listaProductos.addEventListener('click', (e) => {
        if (e.target.classList.contains('plato-boton')) {
            e.preventDefault(); // Evita que el enlace recargue la página
            const tarjeta = e.target.parentElement.parentElement;
            leerDatosProducto(tarjeta);
        }
    });

    // 3. Leer datos del HTML
    const leerDatosProducto = (tarjeta) => {
        const infoProducto = {
            imagen: tarjeta.querySelector('.plato-img').src,
            titulo: tarjeta.querySelector('.plato-nombre').textContent,
            precio: tarjeta.querySelector('.plato-precio').textContent,
            id: tarjeta.querySelector('.plato-nombre').textContent, // Usamos el nombre como ID simple
            cantidad: 1
        }

        // Revisar si ya existe en el carrito
        const existe = carrito.some(producto => producto.id === infoProducto.id);

        if (existe) {
            // Actualizamos la cantidad
            const productos = carrito.map(producto => {
                if (producto.id === infoProducto.id) {
                    producto.cantidad++;
                    return producto;
                } else {
                    return producto;
                }
            });
            // Copiamos el array actualizado
            carrito.splice(0, carrito.length, ...productos);
        } else {
            // Agregamos nuevo
            carrito.push(infoProducto);
        }

        renderizarCarrito();
        // Feedback visual (opcional: abrir carrito al agregar)
        // toggleCarrito(); 
        mostrarNotificacion("Producto agregado");
    }

    // 4. Mostrar en el HTML (Renderizar)
    const renderizarCarrito = () => {
        // Limpiar HTML previo
        contenedorCarrito.innerHTML = '';

        if(carrito.length === 0) {
            contenedorCarrito.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
            precioTotalElemento.textContent = 'S/. 0.00';
            contadorCarrito.textContent = 0;
            return;
        }

        carrito.forEach(producto => {
            const { imagen, titulo, precio, cantidad, id } = producto;
            
            // Convertir precio texto "S/. 48.00" a número para cálculos si fuera necesario, 
            // pero aquí solo mostraremos string
            
            const row = document.createElement('div');
            row.classList.add('carrito-item');
            row.innerHTML = `
                <img src="${imagen}" width="50" style="border-radius:5px; margin-right:10px;">
                <div class="item-info" style="flex:1;">
                    <h4>${titulo}</h4>
                    <p>${precio}</p>
                </div>
                <div class="item-cantidad">
                    <button class="btn-cantidad disminuir" data-id="${id}">-</button>
                    <span>${cantidad}</span>
                    <button class="btn-cantidad aumentar" data-id="${id}">+</button>
                </div>
                <span class="btn-eliminar" data-id="${id}">🗑️</span>
            `;
            contenedorCarrito.appendChild(row);
        });

        actualizarTotal();
    }

    // 5. Funcionalidad de botones dentro del carrito (+, -, eliminar)
    contenedorCarrito.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-eliminar')) {
            const productoId = e.target.getAttribute('data-id');
            eliminarProducto(productoId);
        }
        if (e.target.classList.contains('aumentar')) {
            const productoId = e.target.getAttribute('data-id');
            aumentarCantidad(productoId);
        }
        if (e.target.classList.contains('disminuir')) {
            const productoId = e.target.getAttribute('data-id');
            disminuirCantidad(productoId);
        }
    });

    const eliminarProducto = (id) => {
        const index = carrito.findIndex(producto => producto.id === id);
        carrito.splice(index, 1);
        renderizarCarrito();
    }

    const aumentarCantidad = (id) => {
        const item = carrito.find(prod => prod.id === id);
        item.cantidad++;
        renderizarCarrito();
    }

    const disminuirCantidad = (id) => {
        const item = carrito.find(prod => prod.id === id);
        if (item.cantidad > 1) {
            item.cantidad--;
            renderizarCarrito();
        } else {
            eliminarProducto(id);
        }
    }

    const actualizarTotal = () => {
        let total = 0;
        let totalCantidad = 0;

        carrito.forEach(producto => {
            // Limpiar el string de precio "S/. 48.00" -> 48.00
            const precioNumerico = parseFloat(producto.precio.replace('S/.', '').trim());
            total += precioNumerico * producto.cantidad;
            totalCantidad += producto.cantidad;
        });

        precioTotalElemento.textContent = `S/. ${total.toFixed(2)}`;
        contadorCarrito.textContent = totalCantidad;
    }

    // 6. Finalizar Pedido (WhatsApp)
    btnComprar.addEventListener('click', () => {
        if (carrito.length === 0) {
            alert("Tu carrito está vacío");
            return;
        }

        let mensaje = "Hola Pollería Sahur, deseo realizar el siguiente pedido:%0A%0A";
        
        carrito.forEach(prod => {
            mensaje += `🔹 ${prod.cantidad} x ${prod.titulo} - ${prod.precio}%0A`;
        });

        const totalTexto = precioTotalElemento.textContent;
        mensaje += `%0A*Total a pagar: ${totalTexto}*`;
        mensaje += "%0A%0A📍 Dirección de entrega: (Escribir aquí)";

        // Reemplaza este número con el del negocio
        const numeroWhatsApp = "5491176288202"; 
        
        const url = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
        window.open(url, '_blank');
    });

    // Pequeña notificación visual
    const mostrarNotificacion = (texto) => {
        const notificacion = document.createElement('div');
        notificacion.textContent = texto;
        notificacion.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #333;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 2000;
            animation: fadeInOut 2s ease-in-out forwards;
        `;
        document.body.appendChild(notificacion);
        setTimeout(() => notificacion.remove(), 2000);
    }

    
    
    // Animación simple para notificaciones (agregar al style en JS o CSS)
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes fadeInOut {
            0% { opacity: 0; bottom: 0; }
            20% { opacity: 1; bottom: 20px; }
            80% { opacity: 1; bottom: 20px; }
            100% { opacity: 0; bottom: 0; }
        }
    `;
    document.head.appendChild(styleSheet);

// --- LÓGICA DEL FORMULARIO DE CONTACTO (WHATSAPP) ---

    const formularioContacto = document.querySelector('.formulario');
    
    if (formularioContacto) {
        formularioContacto.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita que la página se recargue

            // 1. Capturar los valores de los inputs
            const nombre = document.querySelector('#nombre').value;
            const telefono = document.querySelector('#telefono').value;
            const email = document.querySelector('#email').value;
            const mensajeUsuario = document.querySelector('#mensaje').value;

            // 2. Validar que no estén vacíos (Opcional, pero recomendado)
            if (nombre.trim() === "" || mensajeUsuario.trim() === "") {
                alert("Por favor, completa al menos tu nombre y el mensaje.");
                return;
            }

            // 3. Construir el mensaje para WhatsApp
            // Usamos %0A para los saltos de línea y *texto* para negritas
            let mensajeWhatsApp = `Hola *Pollería Sahur*, tengo una consulta desde la web:%0A%0A`;
            mensajeWhatsApp += `👤 *Nombre:* ${nombre}%0A`;
            mensajeWhatsApp += `📞 *Teléfono:* ${telefono}%0A`;
            mensajeWhatsApp += `📧 *Email:* ${email}%0A%0A`;
            mensajeWhatsApp += `📝 *Mensaje:*%0A${mensajeUsuario}`;

            // 4. Tu número de teléfono
            const numeroDestino = "5491176288202"; 

            // 5. Crear la URL y abrirla
            const url = `https://wa.me/${numeroDestino}?text=${mensajeWhatsApp}`;
            window.open(url, '_blank');

            // 6. Limpiar el formulario (Opcional)
            formularioContacto.reset();
        });
    }


});
