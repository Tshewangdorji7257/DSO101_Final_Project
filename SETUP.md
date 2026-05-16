# Blog Website - Full Stack Setup Guide

This is a complete blog website with a Next.js frontend and Node.js backend with SQLite database.

## Project Structure

```
DSO FINAL/
├── blog-website/          # Next.js frontend
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/              # Utilities and contexts
│   │   ├── api.ts        # API client for backend
│   │   ├── auth-context.tsx (original mock)
│   │   └── auth-context-new.tsx (backend integrated)
│   └── ...
└── blog-backend/         # Node.js backend
    ├── src/
    │   ├── server.js     # Express server
    │   ├── database/     # SQLite setup
    │   ├── routes/       # API routes
    │   ├── middleware/   # Auth middleware
    │   └── ...
    ├── blog.db           # SQLite database (created on first run)
    └── .env              # Environment variables
```

## Quick Start

### 1. Backend Setup

```bash
cd blog-backend

# Install dependencies
npm install

# Create .env file (copy from .env.example and update if needed)
cp .env.example .env

# Start the backend server
npm run dev
```

The backend will start on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd blog-website

# Install dependencies (if not already done)
npm install

# Create .env.local file
cp .env.example .env.local

# Update the API URL if backend is not on localhost:5000
# In .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start the frontend dev server
npm run dev
```

The frontend will start on `http://localhost:3000`

## Integration Steps

### Update Frontend Auth Context

The frontend currently uses a mock auth implementation. To use the real backend:

1. **Option 1: Replace the existing auth-context.tsx**
   ```bash
   # Backup the original
   cp lib/auth-context.tsx lib/auth-context.original.tsx
   
   # Use the new version
   cp lib/auth-context-new.tsx lib/auth-context.tsx
   ```

2. **Option 2: Update your components manually**
   Use the `api` utilities from `lib/api.ts` in your components:
   ```typescript
   import { api } from '@/lib/api';
   
   // Register
   const response = await api.register(name, email, password);
   
   // Login
   const response = await api.login(email, password);
   
   // Create post
   const post = await api.createPost({
     title: "...",
     excerpt: "...",
     content: "...",
     category: "...",
     readTime: 5,
     imageUrl: "..."
   });
   ```

### Update Components to Use Backend

Update your blog components to use the API client:

```typescript
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

export function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await api.getPosts();
        setPosts(data);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    // Your JSX here
  );
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login to account

### Blog Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (authenticated)
- `PUT /api/posts/:id` - Update post (authenticated, author only)
- `DELETE /api/posts/:id` - Delete post (authenticated, author only)

### User Profile
- `GET /api/users/me` - Get current user profile (authenticated)
- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/posts` - Get user's posts
- `PUT /api/users/me/update` - Update profile (authenticated)
- `POST /api/users/me/change-password` - Change password (authenticated)

## Authentication Flow

1. User registers or logs in through the frontend
2. Backend validates credentials and returns a JWT token
3. Frontend stores token in `localStorage` with key `authToken`
4. Frontend includes token in all authenticated requests via `Authorization: Bearer <token>` header
5. Backend validates token middleware on protected routes
6. Token is valid for 7 days before expiration

## Database

SQLite database is automatically created on first run at `blog-backend/blog.db`

### Tables
- **users**: User accounts (id, name, email, password, avatar, bio, createdAt)
- **posts**: Blog posts (id, title, excerpt, content, imageUrl, category, authorId, readTime, createdAt, updatedAt)
- **comments**: Post comments (id, content, postId, userId, createdAt) - for future use

## Deployment Notes

### Environment Variables
- Backend: Update `JWT_SECRET` in `.env` to a secure random string
- Backend: Update `FRONTEND_URL` to your frontend domain
- Frontend: Update `NEXT_PUBLIC_API_URL` to your backend URL

### Database
- SQLite works great for development and small deployments
- For larger deployments, consider migrating to PostgreSQL or MySQL
- Database file should be backed up regularly

### Security Considerations
- Use HTTPS in production
- Set secure JWT_SECRET
- Use environment variables for all secrets
- Implement rate limiting on auth endpoints
- Add CORS restrictions for frontend domain

## Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Ensure all npm packages are installed: `npm install`
- Check `.env` file exists and has required variables

### Frontend can't connect to backend
- Verify backend is running on `http://localhost:5000`
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Check browser console for CORS errors
- Verify backend CORS settings allow frontend origin

### Database errors
- Delete `blog.db` file and restart backend to reinitialize
- Check file permissions in `blog-backend` directory
- Ensure SQLite3 is properly installed

## Development Tips

- Backend will auto-reload with `npm run dev` when files change
- Frontend has hot module reloading in dev mode
- Use browser DevTools Network tab to debug API calls
- Check backend console for detailed error logs
- Use SQLite browser to inspect database: [DB Browser for SQLite](https://sqlitebrowser.org/)
