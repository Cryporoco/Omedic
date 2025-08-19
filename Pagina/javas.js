const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Configurar body parser para procesar formularios POST
app.use(bodyParser.urlencoded({ extended: false }));

// Conexión a la base de datos MySQL
const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'tu_usuario',
  password: 'tu_contraseña',
  database: 'tu_base_de_datos'
});

conexion.connect(error => {
  if (error) {
    console.error('Error conectando a la base de datos:', error);
  } else {
    console.log('Conectado a la base de datos MySQL');
  }
});

// Servir el archivo HTML del formulario
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'formulario.html'));
});

// Ruta para recibir datos del formulario y guardarlos en la base de datos
app.post('/guardar', (req, res) => {
  const nombre = req.body.nombre;
  const email = req.body.email;

  const sql = 'INSERT INTO usuarios (nombre, email) VALUES (?, ?)';
  conexion.query(sql, [nombre, email], (err, resultado) => {
    if (err) {
      console.error('Error al insertar en la base de datos:', err);
      res.status(500).send('Error en la base de datos');
    } else {
      res.send('Datos guardados correctamente');
    }
  });
});

// Iniciar servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
