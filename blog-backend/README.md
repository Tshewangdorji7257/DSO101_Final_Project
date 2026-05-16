# Blog Backend API

A Node.js backend for the blog website with SQLite database and JWT authentication.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration (especially `JWT_SECRET` for production)

4. Start the server:
```bash
npm run dev    # Development mode with auto-reload
npm start      # Production mode
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```

### Posts

- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (requires authentication)
  ```json
  {
    "title": "Post Title",
    "excerpt": "Short excerpt",
    "content": "Full content",
    "imageUrl": "https://...",
    "category": "Technology",
    "readTime": 5
  }
  ```

- `PUT /api/posts/:id` - Update post (requires authentication, author only)
- `DELETE /api/posts/:id` - Delete post (requires authentication, author only)

### Users

- `GET /api/users/me` - Get current user profile (requires authentication)
- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/posts` - Get user's posts
- `PUT /api/users/me/update` - Update profile (requires authentication)
  ```json
  {
    "name": "Updated Name",
    "avatar": "https://...",
    "bio": "User bio"
  }
  ```

- `POST /api/users/me/change-password` - Change password (requires authentication)
  ```json
  {
    "currentPassword": "oldPassword",
    "newPassword": "newPassword"
  }
  ```

## Authentication

Most endpoints require a JWT token. Include it in the Authorization header:

```
Authorization: Bearer <token>
```

The token is returned after successful login or registration.

## Database

SQLite database file is created at `blog.db` in the project root. Tables include:
- `users` - User accounts
- `posts` - Blog posts
- `comments` - Post comments (for future use)

## Frontend Integration

Update your frontend's API calls to point to `http://localhost:5000/api` (or your deployed backend URL).

Example with authentication:

```javascript
const token = localStorage.getItem('authToken');
const response = await fetch('http://localhost:5000/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(postData)
});
```
