import mongoose from 'mongoose';

let mongodInstance = null;

export async function connectDB(uri = process.env.MONGO_URI || process.env.MONGODB_URI) {
  // If uri explicitly specified in env or passed as param
  if (uri) {
    try {
      const sanitized = uri.replace(/\/\/[^@]*@/, '//***:***@');
      console.log(`Connecting to MongoDB at: ${sanitized}`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
      console.log(`MongoDB connected: ${mongoose.connection.name}`);
      return;
    } catch (err) {
      console.warn(`Could not connect to specified MongoDB URI (${err.message}).`);
      if (process.env.NODE_ENV === 'production') {
        throw err;
      }
      console.log('Attempting local/in-memory fallback for development & instant demo...');
    }
  }

  // Try local default mongodb://127.0.0.1:27017/apexlib
  try {
    const localUri = 'mongodb://127.0.0.1:27017/apexlib';
    await mongoose.connect(localUri, { serverSelectionTimeoutMS: 2500 });
    console.log(`Connected to local MongoDB at: ${localUri}`);
    return;
  } catch (err) {
    console.log(`No active local MongoDB server found on port 27017.`);
  }

  // Graceful fallback to mongodb-memory-server for instant testing & demoing on friend's laptop
  try {
    console.log('Starting in-memory MongoDB server for zero-config demonstration...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const memoryUri = mongodInstance.getUri();
    await mongoose.connect(memoryUri);
    console.log(`Connected to in-memory MongoDB: ${memoryUri}`);
    console.log('TIP: To persist data across restarts, set MONGO_URI in backend/.env with your free MongoDB Atlas URI.');
  } catch (memErr) {
    console.error('Failed to start in-memory MongoDB fallback:', memErr.message);
    throw new Error('MongoDB connection failed. Please ensure MongoDB is running or specify MONGO_URI in backend/.env');
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
}
