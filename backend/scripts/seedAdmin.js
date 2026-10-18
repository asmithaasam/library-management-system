import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDB } from '../src/config/db.js';
import { User, LibrarySettings } from '../src/models/index.js';
import { seedInitialData } from '../src/utils/seedData.js';

async function run() {
  await connectDB();
  const email = (process.env.ADMIN_EMAIL || 'admin@library.local').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin@123456';
  const name = process.env.ADMIN_NAME || 'Administrator';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin account (${email}) already exists.`);
  } else {
    await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: 'admin',
      status: 'active',
      memberCode: 'ADM-001',
    });
    console.log(`Administrator created: ${email}`);
  }

  // Also seed full initial data if DB is empty
  await seedInitialData();
  process.exit(0);
}

run().catch((e) => {
  console.error('Seed admin failed:', e.message);
  process.exit(1);
});
