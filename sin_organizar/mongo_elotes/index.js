/**
 * PUNTO 5: DOCUMENTACIÓN DEL CÓDIGO
 * Aplicación Express para gestionar recetas en MongoDB Atlas.
 */

const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");

// Variables globales para la conexión
let client;
let database;
let collection;

// Middlewares para lectura de JSON en el cuerpo de la petición
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de nombres de BD y Colección
function prepareDB() {
  const dbName = "myDatabase";
  const collectionName = "recipes";
  database = client.db(dbName);
  collection = database.collection(collectionName);
}

// Conexión asíncrona a MongoDB Atlas (PUNTO 2: AJUSTAR URI)
async function connectDB() {
  // RECUERDA: Cambia esta URI por la tuya de MongoDB Atlas
  const uri = "mongodb+srv://abis120802_db_user:wd4U58auQWfP7bFO@cluster0.g3bk0tg.mongodb.net/?appName=cluster0"; 
  client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Conectado exitosamente a MongoDB");
  } catch (e) {
    console.error("Error conectando a la base de datos:", e);
  }
}

/**
 * PUNTO 6: MODIFICACIÓN DEL SERVICIO /receipt/insert
 * Ahora recibe los datos de "recipes" desde el cuerpo (body) de la petición.
 */
app.post("/receipt/insert", async function (req, res) {
  // Los datos se reciben como parámetro en el body
  const recipes = req.body; 

  let responseMsg = "";

  try {
    // Validamos que sea un arreglo antes de insertar
    if (Array.isArray(recipes) && recipes.length > 0) {
      const insertManyResult = await collection.insertMany(recipes);
      responseMsg = `${insertManyResult.insertedCount} documentos insertados con éxito.`;
    } else {
      responseMsg = "Error: Se esperaba un arreglo de recetas.";
    }
  } catch (err) {
    responseMsg = `Error al insertar: ${err.message}`;
  }
  
  res.json({ result: responseMsg });
});

// Inicio del servidor
const PORT = 3000;
app.listen(PORT, async function () {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  await connectDB();
  prepareDB();
});
