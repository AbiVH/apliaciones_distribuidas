const { MongoClient, ServerApiVersion } = require("mongodb");

// URI con tu contraseña ya integrada
const uri =
  "mongodb+srv://abis120802_db_user:wd4U58auQWfP7bFO@cluster0.g3bk0tg.mongodb.net/?appName=cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases();
  console.log("Bases de datos disponibles:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

async function findAllData(client) {
  // Nota: Asegúrate de que la base 'sample_mflix' exista en tu Cluster
  const cursor = client
    .db("sample_mflix")
    .collection("comments")
    .find({})
    .limit(5);
  const results = await cursor.toArray();

  if (results.length > 0) {
    console.log("Película encontrada:", results[0].title);
    console.log(JSON.stringify(results, null, 5));
  } else {
    console.log("No se encontraron documentos en sample_mflix.movies");
  }
}

async function main() {
  try {
    await client.connect();
    console.log("Conexión exitosa a MongoDB Atlas");

    await listDatabases(client);
    await findAllData(client);
  } catch (e) {
    console.error("Error de conexión:", e);
  } finally {
    await client.close();
  }
}

main().catch(console.dir);
