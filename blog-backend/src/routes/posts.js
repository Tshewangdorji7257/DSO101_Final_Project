import express from 'express';
import { getDatabase } from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all posts with author info (user's own posts)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    const userId = req.user.id;
    
    const posts = await db.all(`
      SELECT 
        p.id,
        p.title,
        p.excerpt,
        p.content,
        p.imageUrl,
        p.category,
        p.readTime,
        p.createdAt,
        p.updatedAt,
        p.authorId,
        u.name as authorName,
        u.email as authorEmail,
        u.avatar as authorAvatar
      FROM posts p
      JOIN users u ON p.authorId = u.id
      WHERE p.authorId = ?
      ORDER BY p.createdAt DESC
    `, [userId]);

    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      imageUrl: post.imageUrl,
      category: post.category,
      readTime: post.readTime,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
      author: {
        id: post.authorId,
        name: post.authorName,
        email: post.authorEmail,
        avatar: post.authorAvatar
      }
    }));

    res.json(formattedPosts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    const post = await db.get(`
      SELECT 
        p.id,
        p.title,
        p.excerpt,
        p.content,
        p.imageUrl,
        p.category,
        p.readTime,
        p.createdAt,
        p.updatedAt,
        p.authorId,
        u.name as authorName,
        u.email as authorEmail,
        u.avatar as authorAvatar
      FROM posts p
      JOIN users u ON p.authorId = u.id
      WHERE p.id = ?
    `, [id]);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const formattedPost = {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      imageUrl: post.imageUrl,
      category: post.category,
      readTime: post.readTime,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
      author: {
        id: post.authorId,
        name: post.authorName,
        email: post.authorEmail,
        avatar: post.authorAvatar
      }
    };

    res.json(formattedPost);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Create post
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, excerpt, content, imageUrl, category, readTime } = req.body;
    const authorId = req.user.id;

    if (!title || !excerpt || !content) {
      return res.status(400).json({ error: 'Title, excerpt, and content are required' });
    }

    const db = getDatabase();

    const result = await db.run(
      `INSERT INTO posts (title, excerpt, content, imageUrl, category, readTime, authorId)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, excerpt, content, imageUrl, category || 'General', readTime || 5, authorId]
    );

    const post = await db.get(`
      SELECT 
        p.id,
        p.title,
        p.excerpt,
        p.content,
        p.imageUrl,
        p.category,
        p.readTime,
        p.createdAt,
        p.updatedAt,
        p.authorId,
        u.name as authorName,
        u.email as authorEmail,
        u.avatar as authorAvatar
      FROM posts p
      JOIN users u ON p.authorId = u.id
      WHERE p.id = ?
    `, [result.lastID]);

    res.status(201).json({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      imageUrl: post.imageUrl,
      category: post.category,
      readTime: post.readTime,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
      author: {
        id: post.authorId,
        name: post.authorName,
        email: post.authorEmail,
        avatar: post.authorAvatar
      }
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Update post
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, imageUrl, category, readTime } = req.body;
    const userId = req.user.id;

    const db = getDatabase();

    // Check if post exists and belongs to user
    const post = await db.get('SELECT authorId FROM posts WHERE id = ?', [id]);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== userId) {
      return res.status(403).json({ error: 'Unauthorized to update this post' });
    }

    await db.run(
      `UPDATE posts 
       SET title = ?, excerpt = ?, content = ?, imageUrl = ?, category = ?, readTime = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, excerpt, content, imageUrl, category, readTime, id]
    );

    const updatedPost = await db.get(`
      SELECT 
        p.id,
        p.title,
        p.excerpt,
        p.content,
        p.imageUrl,
        p.category,
        p.readTime,
        p.createdAt,
        p.updatedAt,
        p.authorId,
        u.name as authorName,
        u.email as authorEmail,
        u.avatar as authorAvatar
      FROM posts p
      JOIN users u ON p.authorId = u.id
      WHERE p.id = ?
    `, [id]);

    res.json({
      id: updatedPost.id,
      title: updatedPost.title,
      excerpt: updatedPost.excerpt,
      content: updatedPost.content,
      imageUrl: updatedPost.imageUrl,
      category: updatedPost.category,
      readTime: updatedPost.readTime,
      createdAt: new Date(updatedPost.createdAt),
      updatedAt: new Date(updatedPost.updatedAt),
      author: {
        id: updatedPost.authorId,
        name: updatedPost.authorName,
        email: updatedPost.authorEmail,
        avatar: updatedPost.authorAvatar
      }
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete post
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const db = getDatabase();

    // Check if post exists and belongs to user
    const post = await db.get('SELECT authorId FROM posts WHERE id = ?', [id]);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this post' });
    }

    await db.run('DELETE FROM posts WHERE id = ?', [id]);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

export default router;
