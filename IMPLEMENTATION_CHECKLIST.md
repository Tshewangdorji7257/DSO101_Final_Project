# Implementation Checklist

Complete this checklist to fully integrate the backend with your blog website.

## Phase 1: Backend Setup & Testing ✅

- [ ] Navigate to `blog-backend` directory
- [ ] Run `npm install` to install dependencies
- [ ] Verify `.env` file exists (already created)
- [ ] Run `npm run dev` to start backend server
- [ ] Verify: Server running on http://localhost:5000
- [ ] Verify: Database initialized successfully
- [ ] Check that `blog.db` file was created

## Phase 2: Frontend Setup ✅

- [ ] Navigate to `blog-website` directory
- [ ] Verify `.env.local` exists with API URL
- [ ] Verify `lib/api.ts` exists (API client)
- [ ] Verify `lib/auth-context-new.tsx` exists
- [ ] Run `npm run dev` to start frontend
- [ ] Visit http://localhost:3000 in browser

## Phase 3: Test Authentication

- [ ] Sign up with a new account
  - [ ] Form submits successfully
  - [ ] Account created in database
  - [ ] User logged in automatically
  - [ ] Token stored in localStorage
  
- [ ] Logout
  - [ ] User state cleared
  - [ ] Token removed from localStorage
  
- [ ] Login with existing account
  - [ ] Login with correct credentials works
  - [ ] Login with wrong password fails appropriately
  - [ ] Login with wrong email fails appropriately

## Phase 4: Update Auth Context (Choose One Path)

### Path A: Full Integration (Recommended)

- [ ] Backup current auth context:
  ```bash
  cp lib/auth-context.tsx lib/auth-context.original.tsx
  ```

- [ ] Replace with new version:
  ```bash
  cp lib/auth-context-new.tsx lib/auth-context.tsx
  ```

- [ ] Verify frontend still starts: `npm run dev`
- [ ] Test login/signup again
- [ ] Verify user profile page works (if exists)

### Path B: Manual Integration

- [ ] Keep current auth context
- [ ] Manually update each API call to use `api` client
- [ ] Test after each component update

## Phase 5: Update Components

### Update Login Component

- [ ] Open `app/login/page.tsx`
- [ ] Replace mock API calls with:
  ```typescript
  import { useAuth } from '@/lib/auth-context';
  
  const { login, isLoading, error } = useAuth();
  // Use login() function instead of mock
  ```
- [ ] Test: Try logging in
- [ ] Verify: User data saved in database

### Update Signup Component

- [ ] Open `app/signup/page.tsx`
- [ ] Replace mock API calls with real auth
  ```typescript
  import { useAuth } from '@/lib/auth-context';
  
  const { signup, isLoading, error } = useAuth();
  // Use signup() function
  ```
- [ ] Test: Create new account
- [ ] Verify: User data saved in database

### Update Post List Component

- [ ] Open `components/blog/post-list.tsx`
- [ ] Add imports:
  ```typescript
  import { api } from '@/lib/api';
  import { useEffect, useState } from 'react';
  ```
- [ ] Replace with fetch from backend:
  ```typescript
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await api.getPosts();
        setPosts(data);
      } catch (error) {
        console.error('Failed to load posts:', error);
      }
    };
    
    loadPosts();
  }, []);
  ```
- [ ] Test: Posts load from backend
- [ ] Verify: Database queries work

### Update Post Editor Component

- [ ] Open `components/blog/post-editor.tsx`
- [ ] Add imports:
  ```typescript
  import { api } from '@/lib/api';
  import { useAuth } from '@/lib/auth-context';
  import { useRouter } from 'next/navigation';
  ```
- [ ] Check authentication:
  ```typescript
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <div>Please login to create posts</div>;
  }
  ```
- [ ] Update form submission:
  ```typescript
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createPost(formData);
      router.push('/archive');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };
  ```
- [ ] Test: Create a new post
- [ ] Verify: Post saved to database
- [ ] Verify: Post appears in list

### Update Post Viewer Component

- [ ] Open `components/blog/post-viewer.tsx`
- [ ] Add imports:
  ```typescript
  import { api } from '@/lib/api';
  import { useParams } from 'next/navigation';
  ```
- [ ] Load post:
  ```typescript
  const { id } = useParams();
  const [post, setPost] = useState(null);
  
  useEffect(() => {
    const loadPost = async () => {
      const data = await api.getPost(id);
      setPost(data);
    };
    loadPost();
  }, [id]);
  ```
- [ ] Test: View individual posts
- [ ] Verify: Author info displayed

### Update User Profile Component

- [ ] Open `app/profile/page.tsx` (or create if missing)
- [ ] Add imports:
  ```typescript
  import { useAuth } from '@/lib/auth-context';
  import { api } from '@/lib/api';
  ```
- [ ] Display user info:
  ```typescript
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  ```
- [ ] Add profile update:
  ```typescript
  const handleUpdate = async (data) => {
    await api.updateProfile(data);
  };
  ```
- [ ] Add password change:
  ```typescript
  const handlePasswordChange = async (old, new_) => {
    await api.changePassword(old, new_);
  };
  ```
- [ ] Test: Update profile
- [ ] Test: Change password

## Phase 6: Test Post Operations

- [ ] Create a post
  - [ ] Fills database
  - [ ] Appears in post list
  - [ ] Can be viewed individually

- [ ] Update a post
  - [ ] Only author can edit
  - [ ] Changes saved to database
  - [ ] Updates reflected immediately

- [ ] Delete a post
  - [ ] Only author can delete
  - [ ] Post removed from database
  - [ ] Post removed from UI

## Phase 7: Test Authorization

- [ ] Create post as User A
- [ ] Login as User B
  - [ ] Can view post
  - [ ] Cannot edit post
  - [ ] Cannot delete post

- [ ] Login back as User A
  - [ ] Can edit post
  - [ ] Can delete post

- [ ] Test logged-out access
  - [ ] Can view all posts
  - [ ] Cannot create post
  - [ ] Cannot edit post
  - [ ] Cannot delete post

## Phase 8: Test Error Handling

- [ ] Try to login with wrong password
  - [ ] Error message displayed
  
- [ ] Try to register with existing email
  - [ ] Error message displayed
  
- [ ] Try to create post while not logged in
  - [ ] Redirected or shown error
  
- [ ] Try to update post title to empty
  - [ ] Validation error
  
- [ ] Manually invalidate token
  - [ ] Show "Please login" message

## Phase 9: Test Database Persistence

- [ ] Create a post
- [ ] Stop backend server: `Ctrl+C`
- [ ] Restart backend: `npm run dev`
- [ ] Refresh frontend: `F5`
- [ ] Verify: Post still exists

- [ ] Create user account
- [ ] Stop backend, restart
- [ ] Try to login
- [ ] Verify: Can login with saved credentials

## Phase 10: Cleanup & Documentation

- [ ] Delete mock auth file (keep backup):
  ```bash
  # Keep backup just in case
  # Original is saved as lib/auth-context.original.tsx
  ```

- [ ] Update README to document backend setup
  
- [ ] Document any custom modifications
  
- [ ] Add comments to updated components

- [ ] Test one more time:
  - [ ] Sign up
  - [ ] Create post
  - [ ] View post list
  - [ ] Edit post
  - [ ] Delete post
  - [ ] Logout
  - [ ] Login

## Phase 11: Production Preparation

- [ ] Update `JWT_SECRET` in `.env`:
  ```bash
  # Generate secure random string
  # Min 32 characters
  JWT_SECRET=your-super-long-random-string-here-minimum-32-chars
  ```

- [ ] Update `FRONTEND_URL` in backend `.env` if deploying

- [ ] Test with production build:
  ```bash
  npm run build
  npm start
  ```

- [ ] Plan deployment:
  - [ ] Choose backend hosting (Heroku, Railway, etc.)
  - [ ] Choose frontend hosting (Vercel, Netlify, etc.)
  - [ ] Setup environment variables
  - [ ] Plan database backup strategy

## Phase 12: Deployment (When Ready)

### Deploy Backend
- [ ] Create account on hosting platform
- [ ] Set environment variables
- [ ] Deploy backend
- [ ] Test API endpoints work
- [ ] Monitor logs for errors

### Deploy Frontend
- [ ] Update `NEXT_PUBLIC_API_URL` to production backend
- [ ] Deploy to frontend hosting
- [ ] Test all features work

### Post-Deployment
- [ ] Test login/signup
- [ ] Create a test post
- [ ] Verify SSL/HTTPS working
- [ ] Monitor error logs
- [ ] Plan maintenance

## Quick Troubleshooting

If something isn't working:

1. **Backend not starting:**
   ```bash
   cd blog-backend
   rm -rf node_modules
   npm install
   npm run dev
   ```

2. **Frontend can't reach backend:**
   - Check `.env.local` has correct URL
   - Verify backend is running
   - Check browser console for CORS errors

3. **Database errors:**
   ```bash
   rm blog-backend/blog.db
   npm run dev
   ```

4. **Authentication not working:**
   - Check localStorage has `authToken`
   - Verify JWT_SECRET is same in backend
   - Check backend logs for errors

5. **Component not updating:**
   - Clear browser cache
   - Hard refresh: `Ctrl+Shift+R`
   - Check browser console for errors

## Support Resources

- **QUICK_START.md** - Fast setup guide
- **SETUP.md** - Detailed configuration
- **INTEGRATION_GUIDE.md** - Code examples
- **ARCHITECTURE.md** - System design
- **blog-backend/README.md** - API documentation

## Final Checklist

- [ ] Backend running successfully
- [ ] Frontend running successfully
- [ ] Can sign up new account
- [ ] Can login
- [ ] Can create blog post
- [ ] Post saved to database
- [ ] Can view post
- [ ] Can edit post (author only)
- [ ] Can delete post (author only)
- [ ] Can logout
- [ ] Database persists after restart
- [ ] Error handling works
- [ ] Ready for production!

---

**Status**: Begin with Phase 1 and work through sequentially. This checklist ensures complete integration of your backend with the frontend.

**Questions**: Refer to the support documentation files for specific issues.

**Good luck! 🚀**
