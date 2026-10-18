import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.resolve(__dirname, '../../frontend/dist');

const app = express();
app.disable('x-powered-by');

// Security headers with CSP disabled for SPA assets
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// CORS setup to allow all origins for API calls (localtunnel, vercel, localhost)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false, limit: '5mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('tiny'));
}

// Rate limiting for auth
app.use(
  '/api/v1/auth',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
  })
);

// Mount API routes at both /api/v1 and /api
app.use('/api/v1', routes);
app.use('/api', routes);

// Serve frontend dist if it exists (Production & Local Combined)
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));

  // Catch-all route to index.html for SPA client-side routing
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    const indexPath = path.join(frontendDist, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    return next();
  });
}

// 404 handler for API or missing resources
app.use(notFound);

// Central error handler
app.use(errorHandler);

export default app;
