import { connectToDatabase } from '@/lib/mongodb';

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
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('users');

    // Clear existing users
    await collection.deleteMany({});
    console.log('Cleared existing users');

    // Insert seed users
    const result = await collection.insertMany(seedUsers);
    console.log(`Inserted ${result.insertedCount} users`);

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
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
