// Configuración de Supabase
const SUPABASE_URL = "https://rdwxbhkovlpmlyscostp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkd3hiaGtvdmxwbWx5c2Nvc3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MTcwNzIsImV4cCI6MjA3MjE5MzA3Mn0.qj6EUZ91HiYPIESjBQkpEy-VG5VQacqyPXOg_phbJz0";

// Inicializar Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Variable para almacenar el carrito
let carrito = [];

// Cargar carrito desde localStorage si existe
function cargarCarrito() {
  const carritoGuardado = localStorage.getItem('carritoOmedic');
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarCarritoUI();
  }
}

// Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem('carritoOmedic', JSON.stringify(carrito));
}

// Agregar producto al carrito
function agregarAlCarrito(producto) {
  const productoExistente = carrito.find(item => item.id === producto.id);
  
  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    carrito.push({
      ...producto,
      cantidad: 1
    });
  }
  
  guardarCarrito();
  actualizarCarritoUI();
  mostrarNotificacion(`${producto.name} agregado al carrito`);
}

// Eliminar producto del carrito
function eliminarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  guardarCarrito();
  actualizarCarritoUI();
}

// Actualizar cantidad de un producto en el carrito
function actualizarCantidad(id, nuevaCantidad) {
  if (nuevaCantidad < 1) {
    eliminarDelCarrito(id);
    return;
  }
  
  const producto = carrito.find(item => item.id === id);
  if (producto) {
    producto.cantidad = nuevaCantidad;
    guardarCarrito();
    actualizarCarritoUI();
  }
}

// Vaciar todo el carrito
function vaciarCarrito() {
  if (carrito.length === 0) return;
  
  if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
    carrito = [];
    guardarCarrito();
    actualizarCarritoUI();
    mostrarNotificacion('Carrito vaciado');
  }
}

// Calcular el total del carrito
function calcularTotal() {
  return carrito.reduce((total, item) => total + (item.price * item.cantidad), 0);
}

// Actualizar la interfaz del carrito
function actualizarCarritoUI() {
  const contador = document.getElementById('carrito-contador');
  const itemsContainer = document.getElementById('carrito-items');
  const totalContainer = document.getElementById('carrito-total');
  
  // Actualizar contador
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  if (contador) {
    contador.textContent = totalItems;
  }
  
  // Actualizar items
  if (itemsContainer) {
    itemsContainer.innerHTML = '';
    
    if (carrito.length === 0) {
      itemsContainer.innerHTML = '<p>Tu carrito está vacío</p>';
    } else {
      carrito.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'carrito-item';
        itemElement.innerHTML = `
          <img src="${item.imagen_url}" alt="${item.name}">
          <div class="carrito-item-info">
            <div class="carrito-item-titulo">${item.name}</div>
            <div class="carrito-item-precio">$${(item.price * item.cantidad).toFixed(2)}</div>
            <div class="carrito-item-cantidad">
              <button onclick="actualizarCantidad(${item.id}, ${item.cantidad - 1})">-</button>
              <input type="number" value="${item.cantidad}" min="1" 
                onchange="actualizarCantidad(${item.id}, parseInt(this.value))">
              <button onclick="actualizarCantidad(${item.id}, ${item.cantidad + 1})">+</button>
              <button style="margin-left: 10px; color: red; background: none; border: none; cursor: pointer;" 
                onclick="eliminarDelCarrito(${item.id})">🗑️</button>
            </div>
          </div>
        `;
        itemsContainer.appendChild(itemElement);
      });
    }
  }
  
  // Actualizar total
  if (totalContainer) {
    totalContainer.textContent = `Total: $${calcularTotal().toFixed(2)}`;
  }
}

// Alternar visibilidad del carrito
function toggleCarrito() {
  const carrito = document.getElementById('carrito');
  const overlay = document.getElementById('overlay');
  
  if (carrito && overlay) {
    carrito.classList.toggle('abierto');
    overlay.classList.toggle('activo');
  }
}

// Mostrar notificación
function mostrarNotificacion(mensaje) {
  // Eliminar notificaciones existentes
  const notificacionesExistentes = document.querySelectorAll('.notificacion');
  notificacionesExistentes.forEach(notif => notif.remove());
  
  // Crear elemento de notificación
  const notificacion = document.createElement('div');
  notificacion.className = 'notificacion';
  notificacion.textContent = mensaje;
  
  document.body.appendChild(notificacion);
  
  // Eliminar después de 3 segundos
  setTimeout(() => {
    if (document.body.contains(notificacion)) {
      document.body.removeChild(notificacion);
    }
  }, 3000);
}

// Procesar pago (simulado)
function procesarPago() {
  if (carrito.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }
  
  alert(`¡Gracias por tu compra!\nTotal: $${calcularTotal().toFixed(2)}\n\nEn una implementación real, aquí se redirigiría a un sistema de pago.`);
  
  // Vaciar carrito después de compra
  carrito = [];
  guardarCarrito();
  actualizarCarritoUI();
  toggleCarrito();
}

// Cargar productos desde Supabase
async function cargarProductos() {
  const contenedor = document.getElementById("productos");
  if (!contenedor) return;
  
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    console.error("❌ Error cargando productos:", error);
    contenedor.innerHTML = "<p>Error al cargar los productos. Por favor, intenta nuevamente.</p>";
    return;
  }

  contenedor.innerHTML = "";

  data.forEach(p => {
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

// Verificar autenticación del usuario
async function verificarAutenticacion() {
  const { data: { session } } = await supabase.auth.getSession();
  return session !== null;
}

// Cerrar sesión
async function cerrarSesion() {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    window.location.href = 'index.html';
  }
}

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
  cargarCarrito();
  
  // Solo cargar productos si estamos en una página que los necesita
  if (document.getElementById("productos")) {
    cargarProductos();
  }
  
  // Configurar botones de auth si existen
  const btnCerrarSesion = document.getElementById('cerrar-sesion');
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', cerrarSesion);
  }
  
  // Verificar autenticación y actualizar UI
  verificarAutenticacion().then(estaAutenticado => {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons && estaAutenticado) {
      authButtons.innerHTML = `
        <button onclick="cerrarSesion()">Cerrar sesión</button>
        <div class="carrito-icono" onclick="toggleCarrito()">
          🛒
          <span class="carrito-contador" id="carrito-contador">0</span>
        </div>
      `;
    }
  });
});