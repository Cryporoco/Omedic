// Configuración de Supabase (⚠️ mejor poner la key en variables de entorno)
const SUPABASE_URL = "https://rdwxbhkovlpmlyscostp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkd3hiaGtvdmxwbWx5c2Nvc3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MTcwNzIsImV4cCI6MjA3MjE5MzA3Mn0.qj6EUZ91HiYPIESjBQkpEy-VG5VQacqyPXOg_phbJz0";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function cargarProductos() {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    console.error("❌ Error cargando productos:", error);
    return;
  }

  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";

  data.forEach(p => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <img src="${p.imagen_url}" alt="Imagen del producto ${p.name}">
      <h3>${p.name}</h3>
      <p>Precio: $${p.price ?? "N/A"}</p>
    `;
    contenedor.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", cargarProductos);
