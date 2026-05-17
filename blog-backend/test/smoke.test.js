import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-backend-test-'));
process.env.DATABASE_DIR = tempDir;
process.env.JWT_SECRET = 'test-secret';

const { initializeDatabase, getDatabase } = await import('../src/database/db.js');
const { authenticateToken, generateToken } = await import('../src/middleware/auth.js');

test('initializes the sqlite database and stores users', async () => {
  await initializeDatabase();

  const db = getDatabase();
  assert.ok(db);

  const insertResult = await db.run(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    ['Test User', 'test@example.com', 'hashed-password']
  );

  const savedUser = await db.get('SELECT email FROM users WHERE id = ?', [insertResult.lastID]);

  assert.equal(savedUser.email, 'test@example.com');

  await db.close();
});

test('creates and validates jwt tokens', async () => {
  const token = generateToken({
    id: 1,
    email: 'test@example.com',
    name: 'Test User'
  });

  const req = {
    headers: {
      authorization: `Bearer ${token}`
    }
  };

  const res = {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.payload = body;
      return this;
    }
  };

  await new Promise((resolve) => {
    authenticateToken(req, res, resolve);
  });

  assert.equal(res.statusCode, 200);
  assert.equal(req.user.email, 'test@example.com');
});