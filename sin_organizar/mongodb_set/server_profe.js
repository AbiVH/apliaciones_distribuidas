const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

function iterateFunc(doc) {
  console.log(JSON.stringify(doc, null, 4));
}

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

async function findAllData(client) {
  const cursor = await client
    .db("sample_mflix")
    .collection("comments")
    .find({})
    .limit(5);
  // Convertir cursor a array de documentos
  const results = await cursor.toArray();
  console.log("Title: ", results[0]["title"]);

  // Mostrar resultados
  console.log("Películas encontradas:");
  console.log(JSON.stringify(results, null, 5));
}

async function main() {
  const uri =
    "mongodb+srv://abis120802_db_user:wd4U58auQWfP7bFO@cluster0.g3bk0tg.mongodb.net/?appName=cluster0";

  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make the appropriate DB calls
    await listDatabases(client);
    await findAllData(client);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
