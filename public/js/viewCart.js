console.log('viewCart.js success');

let tablaVistaCarrito = document.getElementById('tablaCarts'); //cantidad de productos en el icono del carrito
let botonFinalizar = document.getElementById('boton-finalizar'); 

let priceTotal = document.getElementById('price');


const mostrarPrecioFinal = changuito => {
    var total = 0;

    if(changuito){
        changuito.forEach(item => {
            total += item.total
        });
    }
    if(total == 0){
        priceTotal.innerText = "$ 0.00"
    }else{
        priceTotal.innerText = "$ " + total
    }

}

const getInfoCart = async () => {
    try {
        let response = await fetch('/api/carts/show')
        let result = await response.json()
        if (result.data.length > 0) {
            ///// mostrarCantidad(result.data)
            loadTable(result.data)

        } else {
            ///////   mostrarCantidad(result.data)

        }
    } catch (error) {
        console.log(error)
    }
}
const loadTable = carrito => {
    console.log("Cargando tabla");
    mostrarPrecioFinal(carrito)
    tablaVistaCarrito.innerHTML = ""
    carrito.forEach(producto => {
        let item = `
        <article class="articulos">
                            <div class="articulo-comprar">
                                <img src="/images/${producto.image}" alt="" />
                            </div>
                            <div class="nombre-articulo">
                                <p>${producto.nombre} </p>
                            </div>
                            <div class="cantidad-articulo">
                                <td class="text-center col-3 align-middle">
                                <a class="text-danger h5" onClick="removeItem(event,${producto.id})"><i class="fas fa-minus-square"></i></a>
                                <span class="h5 px-1">${producto.cantidad}<span>
                                <a class="text-success h5" onClick="addItem(event,${producto.id})"><i class="fas fa-plus-square"></i></a>
                                </td>
                            </div>
                            <div class="precio-articulo">
                                <p>$ ${producto.precio} </p>
                            </div>
                        </article>
            `;
        tablaVistaCarrito.innerHTML += item
    });
    return false
}



getInfoCart()