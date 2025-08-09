import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "turntable.proxy.rlwy.net",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 58523, // convierte a número
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "OQcGOKbYikjtORoeSzBGrpVQZfCiBVoc",
  database: process.env.DB_DATABASE || "railway",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error conectando a la base de datos:", err);
    return;
  }
  console.log("✅ Conectado a MySQL en Railway");
});

export default db;
