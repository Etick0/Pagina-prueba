/* =====================================================
   CONFIGURACIÓN
===================================================== */

const numeroWhatsApp = "50499999999";

let productos = [];
let carrito = [];

let categoriaActual = "Todos";


/* =====================================================
   ELEMENTOS
===================================================== */

const contenedorProductos =
    document.getElementById("productos");

const buscador =
    document.getElementById("buscador");

const sinResultados =
    document.getElementById("sinResultados");

const contadorCarrito =
    document.getElementById("contadorCarrito");

const fondoCarrito =
    document.getElementById("fondoCarrito");

const carritoElemento =
    document.getElementById("carrito");

const listaCarrito =
    document.getElementById("listaCarrito");

const carritoVacio =
    document.getElementById("carritoVacio");

const carritoPie =
    document.getElementById("carritoPie");

const totalProductos =
    document.getElementById("totalProductos");


/* =====================================================
   CARGAR PRODUCTOS
===================================================== */

async function cargarProductos() {

    try {

        const respuesta =
            await fetch("productos/productos.json");

        if (!respuesta.ok) {

            throw new Error(
                "No se pudo cargar productos.json"
            );

        }

        productos =
            await respuesta.json();

        mostrarProductos(productos);

        actualizarCarrito();

    } catch (error) {

        console.error(error);

        contenedorProductos.innerHTML = `

            <div class="mensaje-error">

                <h3>
                    No se pudieron cargar los productos
                </h3>

                <p>
                    Verifica que productos.json
                    esté dentro de la carpeta productos.
                </p>

            </div>

        `;
    }
}


/* =====================================================
   MOSTRAR PRODUCTOS
===================================================== */

function mostrarProductos(lista) {

    contenedorProductos.innerHTML = "";

    if (lista.length === 0) {

        sinResultados.style.display = "block";

        return;
    }

    sinResultados.style.display = "none";


    lista.forEach(producto => {

        const tarjeta =
            document.createElement("article");

        tarjeta.className = "producto";


        /* FOTO */

        let contenidoImagen = "";


        if (
            producto.imagen &&
            producto.imagen.trim() !== ""
        ) {

            contenidoImagen = `

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                    loading="lazy"
                >

            `;

        } else {

            contenidoImagen = `

                <div class="imagen-placeholder">

                    <span>
                        Foto del producto
                    </span>

                </div>

            `;
        }


        /* ETIQUETA */

        let etiqueta = "";


        if (
            producto.etiqueta &&
            producto.etiqueta.trim() !== ""
        ) {

            etiqueta = `

                <span class="etiqueta">
                    ${producto.etiqueta}
                </span>

            `;
        }


        /* TARJETA COMPLETA */

        tarjeta.innerHTML = `

            <div class="producto-imagen">

                ${etiqueta}

                ${contenidoImagen}

            </div>


            <div class="producto-info">

                <span class="producto-categoria">
                    ${producto.categoria}
                </span>


                <h3>
                    ${producto.nombre}
                </h3>


                <p class="producto-precio">
                    L ${Number(producto.precio).toFixed(2)}
                </p>


                <button
                    class="btn-agregar"
                    onclick="agregarAlCarrito(${producto.id})">

                    Agregar al carrito

                </button>

            </div>

        `;


        contenedorProductos.appendChild(tarjeta);

    });
}


/* =====================================================
   FILTRAR CATEGORÍA
===================================================== */

function filtrarCategoria(categoria) {

    categoriaActual = categoria;


    const botones =
        document.querySelectorAll(".categoria-btn");


    botones.forEach(boton => {

        boton.classList.remove("activa");

        const texto =
            boton
                .querySelector("span:last-child")
                ?.textContent
                .trim();


        if (texto === categoria) {

            boton.classList.add("activa");

        }

    });


    aplicarFiltros();

}


/* =====================================================
   BUSCAR
===================================================== */

function buscarProductos() {

    aplicarFiltros();

}


/* =====================================================
   APLICAR FILTROS
===================================================== */

function aplicarFiltros() {

    const texto =
        buscador.value
            .toLowerCase()
            .trim();


    const productosFiltrados =
        productos.filter(producto => {

            const coincideCategoria =
                categoriaActual === "Todos" ||
                producto.categoria === categoriaActual;


            const coincideBusqueda =
                producto.nombre
                    .toLowerCase()
                    .includes(texto);


            return (
                coincideCategoria &&
                coincideBusqueda
            );

        });


    mostrarProductos(productosFiltrados);

}


/* =====================================================
   AGREGAR AL CARRITO
===================================================== */

function agregarAlCarrito(idProducto) {

    const producto =
        productos.find(
            item => item.id === idProducto
        );


    if (!producto) {
        return;
    }


    const existente =
        carrito.find(
            item => item.id === idProducto
        );


    if (existente) {

        existente.cantidad++;

    } else {

        carrito.push({

            ...producto,

            cantidad: 1

        });

    }


    actualizarCarrito();

    abrirCarrito();

}


/* =====================================================
   ACTUALIZAR CARRITO
===================================================== */

function actualizarCarrito() {

    listaCarrito.innerHTML = "";


    if (carrito.length === 0) {

        carritoVacio.style.display = "block";

        carritoPie.style.display = "none";

    } else {

        carritoVacio.style.display = "none";

        carritoPie.style.display = "block";


        carrito.forEach(producto => {

            const item =
                document.createElement("div");

            item.className =
                "item-carrito";


            item.innerHTML = `

                <div class="item-carrito-info">

                    <h4>
                        ${producto.nombre}
                    </h4>

                    <p>
                        L ${Number(producto.precio).toFixed(2)}
                    </p>

                </div>


                <div class="cantidad-control">

                    <button
                        onclick="cambiarCantidad(
                            ${producto.id},
                            -1
                        )">

                        −

                    </button>


                    <span>
                        ${producto.cantidad}
                    </span>


                    <button
                        onclick="cambiarCantidad(
                            ${producto.id},
                            1
                        )">

                        +

                    </button>

                </div>


                <button
                    class="btn-eliminar"
                    onclick="eliminarDelCarrito(
                        ${producto.id}
                    )">

                    ×

                </button>

            `;


            listaCarrito.appendChild(item);

        });

    }


    let cantidadTotal = 0;


    carrito.forEach(producto => {

        cantidadTotal += producto.cantidad;

    });


    totalProductos.textContent =
        cantidadTotal;


    contadorCarrito.textContent =
        cantidadTotal;

}


/* =====================================================
   CAMBIAR CANTIDAD
===================================================== */

function cambiarCantidad(
    idProducto,
    cambio
) {

    const producto =
        carrito.find(
            item => item.id === idProducto
        );


    if (!producto) {
        return;
    }


    producto.cantidad += cambio;


    if (producto.cantidad <= 0) {

        eliminarDelCarrito(idProducto);

        return;
    }


    actualizarCarrito();

}


/* =====================================================
   ELIMINAR
===================================================== */

function eliminarDelCarrito(idProducto) {

    carrito =
        carrito.filter(
            producto =>
                producto.id !== idProducto
        );


    actualizarCarrito();

}


/* =====================================================
   VACIAR
===================================================== */

function vaciarCarrito() {

    carrito = [];

    actualizarCarrito();

}


/* =====================================================
   ABRIR CARRITO
===================================================== */

function abrirCarrito() {

    fondoCarrito.classList.add("abierto");

    carritoElemento.classList.add("abierto");

    document.body.style.overflow = "hidden";

}


/* =====================================================
   CERRAR CARRITO
===================================================== */

function cerrarCarrito() {

    fondoCarrito.classList.remove("abierto");

    carritoElemento.classList.remove("abierto");

    document.body.style.overflow = "";

}


/* =====================================================
   EVITAR QUE EL CLIC DEL CARRITO
   CIERRE EL FONDO
===================================================== */

carritoElemento.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();

    }
);


/* =====================================================
   WHATSAPP
===================================================== */

function abrirWhatsApp() {

    if (carrito.length === 0) {

        alert(
            "Agrega al menos un producto al carrito."
        );

        return;
    }


    let mensaje =
        "Hola, estoy interesado en consultar estos productos:\n\n";


    carrito.forEach(producto => {

        mensaje +=
            `• ${producto.nombre} x${producto.cantidad}\n`;

    });


    mensaje +=
        "\n¿Me podrían brindar información sobre disponibilidad y tallas?";


    const mensajeCodificado =
        encodeURIComponent(mensaje);


    const url =
        `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;


    window.open(
        url,
        "_blank"
    );

}


/* =====================================================
   BUSCADOR
===================================================== */

buscador.addEventListener(
    "input",
    buscarProductos
);


/* =====================================================
   INICIAR
===================================================== */

cargarProductos();