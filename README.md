# 🚀 Blog Website Backend - Start Here!

Your complete blog backend is ready! This file guides you through getting started.

## What You Got

✅ **Backend** - Express.js server with SQLite database  
✅ **Authentication** - JWT-based user accounts  
✅ **API** - Full REST API for posts and users  
✅ **Frontend Updates** - Ready for backend integration  
✅ **Documentation** - Complete guides and examples  

## Quick Start (5 Minutes)

### Terminal 1: Start Backend
```bash
cd blog-backend
npm install
npm run dev
```
Expected output:
```
Server running on http://localhost:5000
Database initialized successfully
```

### Terminal 2: Start Frontend
```bash
cd blog-website
npm install
npm run dev
```
Expected output:
```
- ready started server on 0.0.0.0:3000
```

### Open Browser
Visit: **http://localhost:3000**

## Test It Out

1. **Sign up** with a new email and password
2. **Create a post** with title and content
3. **View posts** on the archive page
4. **Logout and login** - data persists!

## Documentation Guide

| File | Purpose | When to Read |
|------|---------|--------------|
| **QUICK_START.md** | 5-minute setup | ⭐ Start here! |
| **SETUP.md** | Detailed setup & configuration | Full setup details |
| **INTEGRATION_GUIDE.md** | Code examples for components | Integrating backend |
| **ARCHITECTURE.md** | System design & diagrams | Understanding structure |
| **IMPLEMENTATION_CHECKLIST.md** | Step-by-step integration | Full integration guide |
| **BACKEND_SETUP_COMPLETE.md** | Overview of what was created | What's included |

## File Structure

```
DSO FINAL/
├── blog-backend/                    ← NEW Backend
│   ├── src/
│   │   ├── server.js               ← Express server
│   │   ├── database/db.js          ← SQLite setup
│   │   ├── middleware/auth.js      ← JWT middleware
│   │   └── routes/                 ← API endpoints
│   │       ├── auth.js             (login/register)
│   │       ├── posts.js            (CRUD posts)
│   │       └── users.js            (profiles)
│   ├── blog.db                     ← Database (auto-created)
│   ├── package.json
│   ├── .env                        ← Config
│   └── README.md
│
├── blog-website/
│   ├── lib/
│   │   ├── api.ts                  ← NEW API client
│   │   ├── auth-context-new.tsx    ← NEW real auth
│   │   └── auth-context.tsx        ← Original mock
│   ├── .env.local                  ← NEW config
│   └── ... (rest of frontend)
│
├── QUICK_START.md                  ← Start here!
├── SETUP.md
├── INTEGRATION_GUIDE.md
├── ARCHITECTURE.md
├── IMPLEMENTATION_CHECKLIST.md
└── BACKEND_SETUP_COMPLETE.md
```

## Key Features

- ✅ User registration and login
- ✅ JWT authentication tokens
- ✅ Create, read, update, delete blog posts
- ✅ User profiles
- ✅ Password hashing with bcrypt
- ✅ Authorization (only authors can edit/delete posts)
- ✅ SQLite database with proper schema
- ✅ Comprehensive error handling
- ✅ CORS support

## API Endpoints

### Public
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `GET /api/users/:id` - Get user profile

### Protected (Need Login)
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post (author only)
- `DELETE /api/posts/:id` - Delete post (author only)
- `GET /api/users/me` - Get current user
- `PUT /api/users/me/update` - Update profile
- `POST /api/users/me/change-password` - Change password

## Environment Variables

### Backend (.env)
```env
PORT=5000
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Common Commands

### Backend
```bash
cd blog-backend
npm install          # Install dependencies
npm run dev         # Start with auto-reload
npm start           # Start production
```

### Frontend
```bash
cd blog-website
npm install         # Install dependencies
npm run dev        # Start dev server
npm run build      # Build for production
```

### Database
```bash
# Reset database
rm blog-backend/blog.db

# Inspect database (install DB Browser for SQLite)
# or use: sqlite3 blog-backend/blog.db
```

## Next Steps

1. **Run the servers** (Quick Start above)
2. **Test everything** works
3. **Read INTEGRATION_GUIDE.md** for code examples
4. **Update components** to use real backend (optional)
5. **Follow IMPLEMENTATION_CHECKLIST.md** for complete integration

## Troubleshooting

### "Cannot connect to backend"
```bash
# Check if backend is running
# Terminal 1 should show: Server running on http://localhost:5000

# Verify .env.local has correct URL
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### "Database error"
```bash
# Reset database
cd blog-backend
rm blog.db
npm run dev
```

### "Port already in use"
```bash
# Windows
netstat -ano | findstr :5000

# Linux/Mac
lsof -i :5000
```

### "Build fails"
```bash
cd blog-backend
rm -rf node_modules package-lock.yaml
npm install
npm run dev
```

## Support

- **Questions about setup?** → Read **QUICK_START.md**
- **Need code examples?** → See **INTEGRATION_GUIDE.md**
- **Want to understand the system?** → Check **ARCHITECTURE.md**
- **Complete integration guide?** → Follow **IMPLEMENTATION_CHECKLIST.md**
- **API documentation?** → See **blog-backend/README.md**

## Current Status

✅ Backend created with Express.js  
✅ SQLite database with schema  
✅ Authentication implemented  
✅ API endpoints ready  
✅ Frontend API client created  
✅ Documentation complete  

⏭️ **Next: Run the servers and test!**

## Deployment When Ready

- Backend: Deploy to Heroku, Railway, AWS, DigitalOcean, etc.
- Frontend: Deploy to Vercel, Netlify, or your preferred host
- Database: Backup SQLite regularly or migrate to PostgreSQL

---

**You're all set! Run the servers and start building your blog! 🎉**

Questions? All answers are in the documentation files above.
