import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createUUID } from '../components/createUUID.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { action, username, password, email } = req.body;

  try {
    if (action === 'register') {
      // Register new user
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      if (username.length < 3 || username.length > 20) {
        return res.status(400).json({ error: 'Username must be between 3 and 20 characters' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      // Check if username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const secret = createUUID();

      // Create new user
      const newUser = new User({
        username,
        password: hashedPassword,
        email: email || '',
        secret,
      });

      await newUser.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser._id, username: newUser.username },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        success: true,
        token,
        user: {
          secret: newUser.secret,
          username: newUser.username,
          email: newUser.email,
          staff: newUser.staff,
          canMakeClues: newUser.canMakeClues,
          supporter: newUser.supporter,
          accountId: newUser._id
        }
      });

    } else if (action === 'login') {
      // Login existing user
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      // Find user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ error: 'Invalid username or password' });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Invalid username or password' });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        success: true,
        token,
        user: {
          secret: user.secret,
          username: user.username,
          email: user.email,
          staff: user.staff,
          canMakeClues: user.canMakeClues,
          supporter: user.supporter,
          accountId: user._id
        }
      });

    } else if (action === 'verify') {
      // Verify existing session
      const { secret } = req.body;
      if (!secret) {
        return res.status(400).json({ error: 'Secret is required' });
      }

      const user = await User.findOne({ secret });
      if (!user) {
        return res.status(400).json({ error: 'Invalid session' });
      }

      return res.status(200).json({
        secret: user.secret,
        username: user.username,
        email: user.email,
        staff: user.staff,
        canMakeClues: user.canMakeClues,
        supporter: user.supporter,
        accountId: user._id
      });

    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
