import express from 'express';
import { getDatabase } from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    const user = await db.get(
      'SELECT id, name, email, avatar, bio, createdAt FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDatabase();
    const user = await db.get(
      'SELECT id, name, email, avatar, bio, createdAt FROM users WHERE id = ?',
      [req.params.id]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get user's posts
router.get('/:id/posts', async (req, res) => {
  try {
    const db = getDatabase();
    const posts = await db.all(
      `SELECT 
        id, title, excerpt, content, imageUrl, category, readTime, createdAt, updatedAt, authorId
       FROM posts
       WHERE authorId = ?
       ORDER BY createdAt DESC`,
      [req.params.id]
    );

    const formattedPosts = posts.map(post => ({
      ...post,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt)
    }));

    res.json(formattedPosts);
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
});

// Update user profile
router.put('/me/update', authenticateToken, async (req, res) => {
  try {
    const { name, avatar, bio } = req.body;
    const userId = req.user.id;

    const db = getDatabase();

    await db.run(
      'UPDATE users SET name = ?, avatar = ?, bio = ? WHERE id = ?',
      [name, avatar, bio, userId]
    );

    const user = await db.get(
      'SELECT id, name, email, avatar, bio, createdAt FROM users WHERE id = ?',
      [userId]
    );

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.post('/me/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    const db = getDatabase();

    const user = await db.get('SELECT password FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

export default router;
