import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-api-test-'));
process.env.DATABASE_DIR = tempDir;
process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';

const { initializeDatabase, getDatabase } = await import('../src/database/db.js');
const { app } = await import('../src/server.js');

let server;
const BASE_URL = 'http://localhost:3001';

test.before(async () => {
  await initializeDatabase();
  server = app.listen(3001);
});

test.after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  const db = getDatabase();
  if (db) {
    try {
      await db.close();
    } catch (e) {
      // Ignore errors on close
    }
  }
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('POST /api/auth/register - creates new user', async () => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    })
  });

  assert.equal(res.status, 201);
  const data = await res.json();
  assert.ok(data.token);
  assert.equal(data.user.email, 'john@example.com');
});

test('GET /api/health - returns ok status', async () => {
  const res = await fetch(`${BASE_URL}/api/health`);
  
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'ok');
});
