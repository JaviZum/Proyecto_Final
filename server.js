const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // Cambia esto
  password: 'root',   // Cambia esto
  database: 'full_stack_developer_project' // Cambia esto
});

// Conectar a la base de datos
connection.connect(err => {
  if (err) {
    console.error('Error al conectarse a la base de datos: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos.');
});

// Middleware para habilitar CORS
app.use(cors());

// Ruta para obtener preguntas
app.get('/preguntas', (req, res) => {
  connection.query('SELECT * FROM preguntas ORDER BY RAND() LIMIT 10', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error en la consulta');
    }
    res.json(results); // Envía las preguntas como respuesta
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
