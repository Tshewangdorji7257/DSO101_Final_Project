# System Architecture

## Overview

Your blog website is a full-stack application with:
- **Frontend**: Next.js React app
- **Backend**: Express.js API server
- **Database**: SQLite
- **Authentication**: JWT tokens

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        User's Browser                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Next.js Frontend (http://localhost:3000)                 │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │ React Components                                      │ │  │
│  │  │ - Login/Signup Pages                                 │ │  │
│  │  │ - Post Editor                                        │ │  │
│  │  │ - Post List/Viewer                                  │ │  │
│  │  │ - User Profile                                      │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  │                           ▲                                 │  │
│  │                           │                                 │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │ Auth Context                                         │ │  │
│  │  │ - Manages user login state                           │ │  │
│  │  │ - Stores JWT token in localStorage                  │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  │                           ▲                                 │  │
│  │                           │                                 │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │ API Client (lib/api.ts)                             │ │  │
│  │  │ - Wraps all API calls                                │ │  │
│  │  │ - Adds JWT token to headers                         │ │  │
│  │  │ - Handles errors                                    │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  │                           │                                 │  │
│  └───────────────────────────┼─────────────────────────────────┘  │
└────────────────────────────────┼─────────────────────────────────┘
                                 │ HTTP/HTTPS
                    ┌────────────▼─────────────┐
                    │  Network / Internet      │
                    └────────────┬─────────────┘
                                 │
┌────────────────────────────────┼─────────────────────────────────┐
│                    Express.js Backend Server                      │
│                   (http://localhost:5000)                         │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ CORS Middleware                                            │  │
│  │ - Allows requests from frontend                            │  │
│  │ - Validates origin                                         │  │
│  └────────────────────────────────────────────────────────────┘  │
│                           │                                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Routes                                                      │  │
│  │ ┌─────────────────────────────────────────────────────┐   │  │
│  │ │ /api/auth                                            │   │  │
│  │ │ - POST /register - Create user account              │   │  │
│  │ │ - POST /login - Authenticate user                   │   │  │
│  │ └─────────────────────────────────────────────────────┘   │  │
│  │ ┌─────────────────────────────────────────────────────┐   │  │
│  │ │ /api/posts                                           │   │  │
│  │ │ - GET / - Get all posts                              │   │  │
│  │ │ - GET /:id - Get single post                         │   │  │
│  │ │ - POST / - Create post (auth required)               │   │  │
│  │ │ - PUT /:id - Update post (auth required)             │   │  │
│  │ │ - DELETE /:id - Delete post (auth required)          │   │  │
│  │ └─────────────────────────────────────────────────────┘   │  │
│  │ ┌─────────────────────────────────────────────────────┐   │  │
│  │ │ /api/users                                           │   │  │
│  │ │ - GET /me - Get current user (auth required)         │   │  │
│  │ │ - GET /:id - Get user profile                        │   │  │
│  │ │ - GET /:id/posts - Get user's posts                 │   │  │
│  │ │ - PUT /me/update - Update profile (auth required)   │   │  │
│  │ │ - POST /me/change-password - Change password         │   │  │
│  │ └─────────────────────────────────────────────────────┘   │  │
│  └────────────────────────────────────────────────────────────┘  │
│                           │                                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Authentication Middleware                                   │  │
│  │ - Verifies JWT token                                        │  │
│  │ - Extracts user info from token                             │  │
│  │ - Returns 403 for invalid/missing token                     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                           │                                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Database Layer                                              │  │
│  │ - SQLite driver                                             │  │
│  │ - SQL queries                                               │  │
│  │ - Error handling                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬─────────────────────────────────┘
                                 │ Read/Write
                    ┌────────────▼─────────────┐
                    │  SQLite Database         │
                    │  (blog.db)              │
                    └─────────────────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │  Database Tables        │
                    │  - users                │
                    │  - posts                │
                    │  - comments             │
                    │  - indexes              │
                    └─────────────────────────┘
```

## Data Flow: User Login

```
1. User enters email/password in Login form
   ↓
2. Frontend calls api.login(email, password)
   ↓
3. API client adds CORS headers and sends HTTP POST to /api/auth/login
   ↓
4. Backend receives request, verifies credentials against database
   ↓
5. If valid:
   - Backend generates JWT token with user info
   - Returns { user, token }
   ↓
6. Frontend receives response
   ↓
7. Frontend stores token in localStorage (key: 'authToken')
   ↓
8. Frontend updates Auth Context with user info
   ↓
9. User is now logged in and can create/edit posts
```

## Data Flow: Create Post

```
1. Logged-in user fills post form and clicks "Create Post"
   ↓
2. Frontend calls api.createPost(postData)
   ↓
3. API client retrieves token from localStorage
   ↓
4. API client adds token to Authorization header: "Bearer <token>"
   ↓
5. API client sends HTTP POST to /api/posts with post data
   ↓
6. Backend receives request
   ↓
7. Auth middleware verifies JWT token
   ↓
8. If token is valid:
   - Extracts user ID from token
   - Validates post data
   - Inserts post into database with authorId = user ID
   ↓
9. Database inserts post record
   ↓
10. Backend returns new post with auto-generated ID
    ↓
11. Frontend receives post and updates UI
    ↓
12. Post is now saved and visible to all users
```

## Database Schema

### users Table
```sql
users
├── id (INTEGER, PRIMARY KEY, auto-increment)
├── name (TEXT, NOT NULL)
├── email (TEXT, UNIQUE, NOT NULL)
├── password (TEXT, NOT NULL) -- bcrypt hashed
├── avatar (TEXT, nullable)
├── bio (TEXT, nullable)
└── createdAt (DATETIME, default CURRENT_TIMESTAMP)
```

### posts Table
```sql
posts
├── id (INTEGER, PRIMARY KEY, auto-increment)
├── title (TEXT, NOT NULL)
├── excerpt (TEXT, NOT NULL)
├── content (TEXT, NOT NULL)
├── imageUrl (TEXT, nullable)
├── category (TEXT, default 'General')
├── authorId (INTEGER, FOREIGN KEY → users.id)
├── readTime (INTEGER, default 5)
├── createdAt (DATETIME, default CURRENT_TIMESTAMP)
└── updatedAt (DATETIME, default CURRENT_TIMESTAMP)

Indexes:
├── idx_posts_authorId (for faster author lookups)
└── foreign key constraint (cascade delete)
```

### comments Table (Future Use)
```sql
comments
├── id (INTEGER, PRIMARY KEY, auto-increment)
├── content (TEXT, NOT NULL)
├── postId (INTEGER, FOREIGN KEY → posts.id)
├── userId (INTEGER, FOREIGN KEY → users.id)
└── createdAt (DATETIME, default CURRENT_TIMESTAMP)

Indexes:
├── idx_comments_postId
└── idx_comments_userId
```

## Authentication Flow

```
Request from Frontend
        ↓
HTTP GET/POST/PUT/DELETE + Authorization Header
        ↓
Express Server receives request
        ↓
CORS Middleware validates origin
        ↓
Route handler
        ↓
If route requires authentication:
  ├─ authenticateToken middleware runs
  ├─ Extracts token from "Authorization: Bearer <token>" header
  ├─ Verifies token with JWT_SECRET
  ├─ If valid:
  │   ├─ Decodes token to get user info
  │   └─ Adds user info to req.user
  ├─ If invalid:
  │   └─ Returns 403 Forbidden
  └─ Continues to route handler
        ↓
Route handler executes
        ↓
Database operations (if needed)
        ↓
Response sent back to frontend
        ↓
API client processes response
        ↓
Frontend updates state/UI
```

## Key Technologies

### Frontend
- **Next.js 16** - React framework with SSR
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite3** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token generation
- **cors** - Cross-origin resource sharing

### Database
- **SQLite** - Lightweight, file-based SQL database
- Suitable for development and small deployments
- Can be migrated to PostgreSQL/MySQL later

## Security Features

1. **Password Hashing**
   - Passwords hashed with bcrypt (10 rounds)
   - Original password never stored

2. **JWT Authentication**
   - Tokens generated on login
   - Tokens include user ID and email
   - Tokens expire after 7 days
   - Token verified on each protected request

3. **Authorization**
   - Only authors can edit/delete their posts
   - Backend checks authorId matches current user ID

4. **CORS**
   - Only frontend domain can make requests
   - Configurable per environment

5. **SQL Injection Prevention**
   - Uses prepared statements
   - SQLite module handles parameterization

6. **Data Validation**
   - Required fields validated
   - Email format validated
   - Password strength enforced server-side

## Deployment Architecture

```
Production Deployment:
┌──────────────────────────────────────────────────────────────┐
│                     CDN (Optional)                            │
│           Serves static assets globally                       │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────┐
│        Frontend Hosting (Vercel, Netlify, etc.)              │
│  - Next.js app deployed                                      │
│  - HTTPS enforced                                            │
│  - Environment variables set                                 │
│  - Auto-deployed on git push                                 │
└──────────────────────────────────────────────────────────────┘
                          ↓
                    HTTPS Traffic
                          ↓
┌──────────────────────────────────────────────────────────────┐
│  Backend Server (Heroku, Railway, AWS, DigitalOcean, etc.)   │
│  - Express.js app deployed                                   │
│  - HTTPS enforced                                            │
│  - Environment variables set                                 │
│  - Auto-scaled/load-balanced                                 │
│  - Monitors and logging                                      │
└──────────────────────────────────────────────────────────────┘
                          ↓
                     SQL Queries
                          ↓
┌──────────────────────────────────────────────────────────────┐
│         Database (Upgrade from SQLite)                       │
│  - PostgreSQL or MySQL in production                         │
│  - Managed database service (AWS RDS, etc.)                  │
│  - Daily backups                                             │
│  - High availability setup                                   │
└──────────────────────────────────────────────────────────────┘
```

## Performance Considerations

1. **Database Indexes**
   - `idx_posts_authorId` - Fast author lookups
   - `idx_comments_postId` - Fast comment lookups
   - `idx_comments_userId` - Fast user comment lookups

2. **API Optimization**
   - Post list returns all posts (consider pagination for large datasets)
   - Joined queries to avoid N+1 problem
   - Indexed foreign keys

3. **Frontend Optimization**
   - Next.js automatic code splitting
   - Image optimization
   - API responses cached client-side

4. **Scaling Considerations**
   - SQLite suitable for < 10,000 monthly users
   - Migrate to PostgreSQL/MySQL at scale
   - Add Redis cache layer for frequent queries
   - Implement pagination for large datasets
   - Add CDN for static assets

## Error Handling

```
Frontend API Call
        ↓
Backend receives request
        ↓
Error occurs:
├─ 400 Bad Request - Missing/invalid data
├─ 401 Unauthorized - Invalid credentials
├─ 403 Forbidden - Invalid token
├─ 404 Not Found - Resource doesn't exist
├─ 409 Conflict - Email already registered
└─ 500 Server Error - Internal error
        ↓
Response with error JSON:
{ "error": "Human-readable error message" }
        ↓
Frontend receives error
        ↓
API client throws APIError
        ↓
Component catches and displays error to user
```

## Future Enhancements

```
Current System:
┌─────────────────┐
│   Frontend      │
└────────┬────────┘
         │
┌────────▼────────┐
│  Backend API    │
└────────┬────────┘
         │
┌────────▼────────┐
│  SQLite DB      │
└─────────────────┘

Enhanced System:
┌─────────────────┐        ┌──────────────┐
│   Frontend      │        │ Admin Panel  │
└────────┬────────┘        └──────┬───────┘
         │                        │
         └────────────┬───────────┘
                      │
         ┌────────────▼─────────────┐
         │   Backend API            │
         │ - Posts                  │
         │ - Comments               │
         │ - Likes                  │
         │ - Notifications          │
         │ - File uploads           │
         └────────────┬─────────────┘
                      │
         ┌────────────▼─────────────┐
         │   PostgreSQL             │
         │ (upgraded from SQLite)   │
         └────────────┬─────────────┘
                      │
         ┌────────────▼─────────────┐
         │   Redis Cache            │
         │ (for performance)        │
         └─────────────────────────┘
```

This architecture provides a solid foundation for scaling as your blog grows!
