# Quick Start Guide

Get your blog website up and running with backend and database in 5 minutes!

## Prerequisites

- Node.js 16+ installed
- npm or pnpm

## Step 1: Start the Backend (Terminal 1)

```bash
cd blog-backend
npm install
npm run dev
```

You should see:
```
Server running on http://localhost:5000
Database initialized successfully
```

## Step 2: Start the Frontend (Terminal 2)

```bash
cd blog-website
npm install
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:3000
```

## Step 3: Visit the Website

Open your browser and go to: **http://localhost:3000**

## Step 4: Test the Features

### 1. Sign Up
- Click "Sign Up"
- Fill in the form and submit
- You'll be logged in automatically

### 2. Create a Blog Post
- Click "Create Post" (or navigate to post editor)
- Fill in the post details
- Click "Create Post"

### 3. View Posts
- Posts appear on the home page and archive

### 4. Login/Logout
- Logout from your profile
- Login with your credentials
- Your posts are saved in the database

## File Structure

```
blog-backend/
├── src/
│   ├── server.js              # Main Express server
│   ├── database/db.js         # SQLite setup
│   ├── middleware/auth.js     # JWT auth
│   ├── routes/
│   │   ├── auth.js            # Login/Register
│   │   ├── posts.js           # Post CRUD
│   │   └── users.js           # User profiles
│   └── ...
├── blog.db                    # Database (auto-created)
├── package.json
└── .env                       # Configuration

blog-website/
├── app/
│   ├── login/page.tsx         # Update to use api.login()
│   ├── signup/page.tsx        # Update to use api.register()
│   └── ...
├── components/
│   ├── blog/
│   │   ├── post-editor.tsx    # Update to use api.createPost()
│   │   ├── post-list.tsx      # Update to use api.getPosts()
│   │   └── ...
│   └── ...
├── lib/
│   ├── api.ts                 # API client
│   ├── auth-context.tsx       # Mock auth (replace with auth-context-new.tsx)
│   ├── auth-context-new.tsx   # Real backend auth
│   └── ...
├── package.json
└── .env.local                 # Configuration
```

## Database Schema

The SQLite database has these tables:

### users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### posts
```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  imageUrl TEXT,
  category TEXT DEFAULT 'General',
  authorId INTEGER NOT NULL,
  readTime INTEGER DEFAULT 5,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (authorId) REFERENCES users(id)
);
```

### comments (for future use)
```sql
CREATE TABLE comments (
  id INTEGER PRIMARY KEY,
  content TEXT NOT NULL,
  postId INTEGER NOT NULL,
  userId INTEGER NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (postId) REFERENCES posts(id),
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login user |
| GET | /api/posts | No | Get all posts |
| GET | /api/posts/:id | No | Get single post |
| POST | /api/posts | Yes | Create post |
| PUT | /api/posts/:id | Yes | Update post |
| DELETE | /api/posts/:id | Yes | Delete post |
| GET | /api/users/me | Yes | Get current user |
| GET | /api/users/:id | No | Get user profile |
| GET | /api/users/:id/posts | No | Get user's posts |
| PUT | /api/users/me/update | Yes | Update profile |
| POST | /api/users/me/change-password | Yes | Change password |

## Common Issues

### "Cannot GET /api/posts"
- Backend is not running
- Check if `npm run dev` is running in blog-backend directory

### CORS Error
- Frontend and backend URLs don't match in .env.local
- Verify `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

### "Invalid token"
- Token expired (valid for 7 days)
- Login again to get a new token

### Database locked
- Another process is using the database
- Restart the backend server

### Posts not saving
- Ensure you're logged in
- Check browser console for errors
- Check backend console for database errors

## Next Steps

1. **Replace mock auth context**
   ```bash
   cd blog-website
   cp lib/auth-context.tsx lib/auth-context.original.tsx
   cp lib/auth-context-new.tsx lib/auth-context.tsx
   ```

2. **Update components to use real API**
   - See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for examples

3. **Customize the blog**
   - Add more categories
   - Add comments feature
   - Add likes/reactions
   - Add tags

4. **Deploy**
   - Backend: Deploy to Heroku, Railway, or your server
   - Frontend: Deploy to Vercel, Netlify
   - Database: Backup SQLite file regularly

## Support Files

- **SETUP.md** - Detailed setup and configuration
- **INTEGRATION_GUIDE.md** - How to integrate backend with components
- **blog-backend/README.md** - Backend API documentation

## Troubleshooting Commands

```bash
# Clean reinstall backend
cd blog-backend
rm -rf node_modules
rm package-lock.yaml
npm install
npm run dev

# Reset database
rm blog-backend/blog.db
npm run dev # in blog-backend

# Check if ports are in use
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :5000
lsof -i :3000
```

## Key Features Implemented

✅ User authentication with JWT  
✅ SQLite database with proper schema  
✅ Blog post CRUD operations  
✅ User profiles  
✅ Password hashing with bcrypt  
✅ Authorization (only authors can edit/delete posts)  
✅ CORS support  
✅ Proper error handling  
✅ Environment configuration  

## Ready to Go!

Your full-stack blog website is ready to use. Start creating posts! 🚀
