import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'MAGIC-LINK-DB';

const seedUsers = [
  {
    email: 'john.doe@example.com',
    accessCount: 3,
    createdAt: new Date('2026-06-01'),
    lastAccessAt: new Date('2026-06-03'),
  },
  {
    email: 'jane.smith@example.com',
    accessCount: 1,
    createdAt: new Date('2026-06-04'),
    lastAccessAt: new Date('2026-06-04'),
  },
  {
    email: 'test.user@example.com',
    accessCount: 2,
    createdAt: new Date('2026-06-02'),
    lastAccessAt: new Date('2026-06-03'),
  },
  {
    email: 'demo@example.com',
    accessCount: 1,
    createdAt: new Date('2026-06-04'),
    lastAccessAt: new Date('2026-06-04'),
  },
];

async function seedDatabase() {
  let client;
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(MONGODB_DB);
    const collection = db.collection('users');

    // Clear existing users
    await collection.deleteMany({});
    console.log('Cleared existing users');

    // Insert seed users
    const result = await collection.insertMany(seedUsers);
    console.log(`\nInserted ${result.insertedCount} users`);

    // Display inserted users
    const users = await collection.find({}).toArray();
    console.log('\nSeeded users:');
    users.forEach((user) => {
      console.log(
        `- ${user.email} (accessCount: ${user.accessCount})`
      );
    });

    console.log('\nDatabase seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

seedDatabase();
