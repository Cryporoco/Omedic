// Funcionalidades específicas para la página de productos

// Variables globales
let todosProductos = [];
let productosFiltrados = [];

// Inicializar la página de productos
function inicializarProductos() {
  console.log("Página de productos cargada");
  cargarProductos();
  configurarFiltros();
}

// Cargar productos desde Supabase
async function cargarProductos() {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    console.error("❌ Error cargando productos:", error);
    mostrarError("Error al cargar los productos. Por favor, intenta nuevamente.");
    return;
  }

  todosProductos = data;
  productosFiltrados = [...todosProductos];
  mostrarProductos(productosFiltrados);
}

// Mostrar productos en la página
function mostrarProductos(productos) {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";

  if (productos.length === 0) {
    contenedor.innerHTML = '<p class="sin-productos">No se encontraron productos que coincidan con tu búsqueda.</p>';
    return;
  }

  productos.forEach(p => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <img src="${p.imagen_url}" alt="Imagen del producto ${p.name}">
      <h3>${p.name}</h3>
      <p>Precio: $${p.price ?? "N/A"}</p>
      <button onclick="agregarAlCarrito(${JSON.stringify(p).replace(/"/g, '&quot;')})">Agregar al carrito</button>
    `;
    contenedor.appendChild(div);
  });
}

// Configurar event listeners para los filtros
function configurarFiltros() {
  document.getElementById("categoria-filtro").addEventListener("change", filtrarProductos);
  document.getElementById("ordenar-por").addEventListener("change", filtrarProductos);
  document.getElementById("buscar-producto").addEventListener("input", filtrarProductos);
}

// Filtrar y ordenar productos
function filtrarProductos() {
  const categoria = document.getElementById("categoria-filtro").value;
  const orden = document.getElementById("ordenar-por").value;
  const busqueda = document.getElementById("buscar-producto").value.toLowerCase();
  
  // Filtrar por búsqueda
  productosFiltrados = todosProductos.filter(producto => 
    producto.name.toLowerCase().includes(busqueda)
  );
  
  // Filtrar por categoría (si no es "todos")
  if (categoria !== "todos") {
    // Aquí deberías tener un campo categoría en tu tabla de productos
    // Por ahora, como ejemplo, filtramos por nombre que contenga la categoría
    productosFiltrados = productosFiltrados.filter(producto => 
      producto.name.toLowerCase().includes(categoria)
    );
  }
  
  // Ordenar productos
  switch(orden) {
    case "nombre":
      productosFiltrados.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "precio-asc":
      productosFiltrados.sort((a, b) => (a.price || 0) - (b.price || 0));
      break;
    case "precio-desc":
      productosFiltrados.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
  }
  
  mostrarProductos(productosFiltrados);
}

// Mostrar mensaje de error
function mostrarError(mensaje) {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = `<p class="error">${mensaje}</p>`;
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarProductos);