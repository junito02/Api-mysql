import express from "express";
import cors from "cors";
import db from "./db/db.js";

const PORT = process.env.PORT || 5000;

const app = express();
app.disable("x-powered-by");
app.use(cors());
app.use(express.json());

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Bienvenido a mi servidor");
});

// Obtener todos los usuarios
app.get("/api/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Obtener un usuario por ID
app.get("/api/users/:id", (req, res) => {
  const sql = "SELECT * FROM users WHERE id = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(results[0]);
  });
});

// Crear nuevo usuario
app.post("/api/users", (req, res) => {
  const { nombre, apellido, direccion, edad } = req.body;
  if (!nombre || !apellido || !direccion || edad == null) {
    return res.status(400).json({ error: "Campos incompletos" });
  }

  const sql =
    "INSERT INTO users (nombre, apellido, direccion, edad) VALUES (?, ?, ?, ?)";
  db.query(sql, [nombre, apellido, direccion, edad], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res
      .status(201)
      .json({ id: result.insertId, nombre, apellido, direccion, edad });
  });
});

// Actualizar usuario
app.put("/api/users/:id", (req, res) => {
  const { nombre, apellido, direccion, edad } = req.body;
  const sql =
    "UPDATE users SET nombre = ?, apellido = ?, direccion = ?, edad = ? WHERE id = ?";
  db.query(
    sql,
    [nombre, apellido, direccion, edad, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Usuario no encontrado" });
      res.json({ id: req.params.id, nombre, apellido, direccion, edad });
    }
  );
});

// Eliminar usuario
app.delete("/api/users/:id", (req, res) => {
  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado con éxito" });
  });
});

// Servidor en ejecución
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
