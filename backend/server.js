import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { seedInitialData } from './src/utils/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Port and MongoDB URI configuration with fallbacks
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

// Serve frontend dist in production using express.static and catch-all route to index.html
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    const indexHtml = path.join(frontendDist, 'index.html');
    if (fs.existsSync(indexHtml)) {
      return res.sendFile(indexHtml);
    }
    return next();
  });
}

try {
  await connectDB(mongoUri);
  // Auto-seed initial demo data if database is empty
  await seedInitialData();

  app.listen(port, () => {
    console.log(`====================================================`);
    console.log(`  APEXLIB — Library Management System is running!   `);
    console.log(`  Local URL:    http://localhost:${port}             `);
    console.log(`  API Endpoint: http://localhost:${port}/api/v1      `);
    console.log(`====================================================`);
  });
} catch (e) {
  console.error('Server startup failed:', e.message);
  process.exit(1);
}
