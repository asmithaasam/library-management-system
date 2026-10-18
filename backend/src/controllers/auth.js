import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/index.js';
import { HttpError, ok, asyncHandler } from '../utils/http.js';

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(128),
  phone: z.string().optional(),
});

export const register = asyncHandler(async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, 'Invalid registration details', parsed.error.issues.map((x) => x.message));
  }
  const { name, email, password, phone } = parsed.data;
  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    throw new HttpError(409, 'An account with this email address already exists');
  }

  const user = await User.create({
    name,
    email: email.toLowerCase().trim(),
    password: await bcrypt.hash(password, 10),
    role: 'member',
    status: 'active',
    phone: phone || '',
    memberCode: `STU-${Date.now().toString().slice(-6)}`,
  });

  return ok(res, { user, token: tokenFor(user) }, 201);
});

export const login = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').toLowerCase().trim();
  const password = String(req.body.password || '');
  if (!email || !password) {
    throw new HttpError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new HttpError(401, 'Invalid email or password');
  }
  if (user.status !== 'active') {
    throw new HttpError(403, 'Your account is currently inactive or suspended');
  }

  return ok(res, { user, token: tokenFor(user) });
});

export const me = asyncHandler(async (req, res) => ok(res, { user: req.user }));

function tokenFor(user) {
  const secret = process.env.JWT_SECRET || 'apexlib-super-secret-jwt-key-2026-production-ready-32-chars';
  return jwt.sign(
    { sub: user._id, role: user.role, email: user.email, name: user.name },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d', issuer: 'apexlib-system' }
  );
}
