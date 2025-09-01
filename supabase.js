import { createClient } from '@supabase/supabase-js'

// 🔑 Usa tus credenciales desde el panel de Supabase
const supabaseUrl = "https://rdwxbhkovlpmlyscostp.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkd3hiaGtvdmxwbWx5c2Nvc3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MTcwNzIsImV4cCI6MjA3MjE5MzA3Mn0.qj6EUZ91HiYPIESjBQkpEy-VG5VQacqyPXOg_phbJz0"

// Conexión
export const supabase = createClient(supabaseUrl, supabaseKey)

// Ejemplo: obtener datos de la tabla "productos"
async function getProductos() {
  let { data, error } = await supabase.from("products").select("*")
  if (error) {
    console.error("Error:", error)
  } else {
    console.log("Productos:", data)
  }
}

getProductos()
