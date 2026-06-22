const { MongoClient } = require('mongodb');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const mongoDb = process.env.MONGODB_DB || 'MAGIC-LINK-DB';

async function testConnection() {
  const client = new MongoClient(mongoUri);
  try {
    console.log(`🔗 Intentando conectar a: ${mongoUri}`);
    await client.connect();
    console.log('✅ Conexión exitosa a MongoDB');

    const db = client.db(mongoDb);
    const collections = await db.listCollections().toArray();
    console.log(`📦 Base de datos: ${mongoDb}`);
    console.log(`📊 Colecciones: ${collections.map(c => c.name).join(', ') || 'ninguna'}`);

    // Contar usuarios
    const usersCollection = db.collection('users');
    const count = await usersCollection.countDocuments();
    console.log(`👥 Total usuarios: ${count}`);

    // Mostrar usuarios
    const users = await usersCollection.find({}).limit(3).toArray();
    console.log(`\n📋 Primeros usuarios:`);
    users.forEach(user => {
      console.log(`   - ${user.email} (accesos: ${user.accessCount})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✅ Conexión cerrada');
  }
}

testConnection();
