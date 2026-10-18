import 'dotenv/config';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { seedInitialData } from '../src/utils/seedData.js';

async function run() {
  try {
    await connectDB();
    await seedInitialData();
    console.log('Seed completed successfully.');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

run();
