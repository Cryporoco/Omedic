const productos = [
  { id: 1, nombre: "Camiseta", precio: 200 },
  { id: 2, nombre: "Pantalón", precio: 450 },
  { id: 3, nombre: "Zapatos", precio: 900 },
];

let carrito = [];

function mostrarProductos() {
  const productosDiv = document.getElementById("productos");
  productosDiv.innerHTML = "";
  productos.forEach(prod => {
    const div = document.createElement("div");
    div.className = "producto";
    div.textContent = `${prod.nombre} - $${prod.precio}`;
    const boton = document.createElement("button");
    boton.textContent = "Agregar al carrito";
    boton.onclick = () => agregarAlCarrito(prod.id);
    div.appendChild(boton);
    productosDiv.appendChild(div);
  });
}

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  const itemCarrito = carrito.find(item => item.id === id);
  if (itemCarrito) {
    itemCarrito.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  mostrarCarrito();
}

function mostrarCarrito() {
  const carritoUl = document.querySelector("#carrito ul");
  carritoUl.innerHTML = "";
  let total = 0;
  carrito.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}`;
    carritoUl.appendChild(li);
    total += item.precio * item.cantidad;
  });
  document.getElementById("total").textContent = total;
}

document.getElementById("vaciar").onclick = () => {
  carrito = [];
  mostrarCarrito();
};

mostrarProductos();
mostrarCarrito();
